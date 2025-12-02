
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import type { ChatMessage, SidebarItem } from '../types';
import { queryVn, queryCharacter, queryRelease, queryProducer, queryStaff, queryTag, queryTrait, queryQuote } from './vndbService';
import {
  VALID_FIELDS,
  getSystemInstruction,
  queryVnFunctionDeclaration,
  queryCharacterFunctionDeclaration,
  queryReleaseFunctionDeclaration,
  queryProducerFunctionDeclaration,
  queryStaffFunctionDeclaration,
  queryTagFunctionDeclaration,
  queryTraitFunctionDeclaration,
  queryQuoteFunctionDeclaration
} from './geminiConstants';


if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 2000;
const MAX_EMPTY_RETRIES = 2;


/**
 * Sends a message to the Gemini chat API with retry logic for transient errors.
 * @param chat The chat instance.
 * @param message The message payload to send.
 * @param onToolActivity Optional callback to log retry attempts to the UI.
 * @returns The response from the Gemini API.
 */
async function sendMessage(
  chat: Chat,
  message: any,
  onToolActivity?: (log: string) => void
): Promise<GenerateContentResponse> {
  let retries = 0;
  let delay = INITIAL_DELAY_MS;

  while (retries < MAX_RETRIES) {
    try {
      const response = await chat.sendMessage(message);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Check for specific retryable errors (503, overloaded, 429/rate limit)
      if (
        errorMessage.includes('503') ||
        errorMessage.includes('overloaded') ||
        errorMessage.includes('429') ||
        errorMessage.includes('RESOURCE_EXHAUSTED')
      ) {
        retries++;
        if (retries >= MAX_RETRIES) {
          console.error('Max retries reached. Giving up.', error);
          // Throw a user-friendly error that will be caught by the App component
          throw new Error('The model is currently overloaded. Please try again in a few moments.');
        }

        const waitSeconds = delay / 1000;
        const retryMessage = `Model is busy. Retrying in ${waitSeconds}s... (Attempt ${retries}/${MAX_RETRIES})`;
        
        console.log(retryMessage, error);
        if (onToolActivity) {
          onToolActivity(retryMessage);
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        // For non-retryable errors, throw immediately to be handled by the UI
        console.error('Non-retryable error calling Gemini API:', error);
        throw error;
      }
    }
  }

  // This should be unreachable if MAX_RETRIES > 0, but is a safeguard.
  throw new Error('sendMessage failed after exhausting retries.');
}

const availableTools = {
  queryVn,
  queryCharacter,
  queryRelease,
  queryProducer,
  queryStaff,
  queryTag,
  queryTrait,
  queryQuote,
};

export async function runGemini(userMessage: ChatMessage, history: ChatMessage[], onDataRetrieved: (data: SidebarItem[]) => void, onToolActivity: (log: string) => void) {
    const currentDate = new Date().toISOString().split('T')[0];
    const hasImage = userMessage.parts.some(p => p.inlineData);
    const systemInstruction = getSystemInstruction(currentDate, hasImage);

    const chat = ai.chats.create({
        model: model,
        config: {
            systemInstruction: systemInstruction,
            tools: [{ functionDeclarations: [
                queryVnFunctionDeclaration, 
                queryCharacterFunctionDeclaration, 
                queryReleaseFunctionDeclaration,
                queryProducerFunctionDeclaration,
                queryStaffFunctionDeclaration,
                queryTagFunctionDeclaration,
                queryTraitFunctionDeclaration,
                queryQuoteFunctionDeclaration
            ] }],
        },
        history,
    });

    let response = await sendMessage(chat, { message: userMessage.parts }, onToolActivity);
    let emptyResponseRetries = 0;

    // Main loop to handle tool calls and retries for empty responses
    while (true) {
        // 1. Handle tool calls if they exist
        if (response.functionCalls && response.functionCalls.length > 0) {
            emptyResponseRetries = 0; // Reset retry counter on new tool activity
            const toolResponses: any[] = [];
            
            for (const call of response.functionCalls) {
                const { name, args } = call;
                if (name in availableTools) {
                    let logMessage = `Calling tool: \`${name}\``;
                    if (args.filters) {
                        try {
                            const prettyFilters = JSON.stringify(JSON.parse(args.filters as string));
                            logMessage += ` with filters: \`${prettyFilters}\``;
                        } catch (e) {
                            logMessage += ` with filters: \`${String(args.filters)}\``;
                        }
                    }
                    onToolActivity(logMessage);
                    console.log(`Calling tool: ${name} with args:`, args);

                    const toolArgs = { ...args };
                    let invalidFieldsNote = '';

                    if ('fields' in toolArgs && typeof toolArgs.fields === 'string') {
                        const requestedFields = toolArgs.fields.split(',').map(f => f.trim()).filter(Boolean);
                        const validFieldSet = VALID_FIELDS[name];

                        if (validFieldSet) {
                            const validRequestedFields: string[] = [];
                            const invalidRequestedFields: string[] = [];

                            for (const field of requestedFields) {
                                if (validFieldSet.has(field)) {
                                    validRequestedFields.push(field);
                                } else {
                                    invalidRequestedFields.push(field);
                                }
                            }
                            
                            if (validRequestedFields.length === 0 && requestedFields.length > 0) {
                                const errorResult = { error: `The API call was cancelled because all requested fields were invalid.` };
                                invalidFieldsNote = `CRITICAL: All requested fields were invalid and have been removed. The API call was not made. Invalid fields: ${invalidRequestedFields.join(', ')}. You MUST use valid fields from the documentation.`;
                                onToolActivity(invalidFieldsNote);
                                const responsePayload = { 
                                    result: [errorResult],
                                    note: invalidFieldsNote
                                };
                                toolResponses.push({
                                    functionResponse: { name: call.name, response: responsePayload }
                                });
                                continue;
                            }

                            if (invalidRequestedFields.length > 0) {
                                toolArgs.fields = validRequestedFields.join(',');
                                invalidFieldsNote = `Note: The following requested fields are invalid for the '${name}' tool and were removed: ${invalidRequestedFields.join(', ')}. Please only use fields listed in the tool's documentation.`;
                                onToolActivity(invalidFieldsNote);
                            }
                        }
                    }
                    
                    const tool = availableTools[name as keyof typeof availableTools];
                    // @ts-ignore
                    const result = await tool(toolArgs);
                    const resultItems = Array.isArray(result?.results) ? result.results : [];
                    
                    const validResults = resultItems.filter((item: any) => item && !item.error);
                    const errorResults = resultItems.filter((item: any) => item && item.error);

                    let limitNote = '';
                    if (validResults.length === 100 && args.results === undefined) {
                        limitNote = 'Note: The query returned 100 results, which is the default limit. There might be more results available.';
                    }

                    let toolLogMessage: string;
                    if (result.count !== undefined) {
                        toolLogMessage = `Tool \`${name}\` completed. Found ${result.count} total matches. Fetched ${validResults.length} item(s).`;
                    } else {
                        toolLogMessage = `Tool \`${name}\` completed. Found ${validResults.length} result(s).`;
                        if (validResults.length === 100 && args.results === undefined) {
                            toolLogMessage += ' (default limit reached)';
                        }
                    }
                    onToolActivity(toolLogMessage);
                    
                    if (errorResults.length > 0) {
                        onToolActivity(`Tool \`${name}\` encountered an error: ${errorResults.map((e: any) => e.error).join(', ')}`);
                    }

                    if (validResults.length > 0) {
                        onDataRetrieved(validResults as SidebarItem[]);
                    }
                    
                    const responsePayload: { result: any, note?: string } = { result };
                    const notes = [invalidFieldsNote, limitNote].filter(Boolean);
                    if (notes.length > 0) {
                        responsePayload.note = notes.join(' ');
                    }

                    toolResponses.push({
                        functionResponse: { name: call.name, response: responsePayload }
                    });
                }
            }
            
            response = await sendMessage(chat, { message: toolResponses }, onToolActivity);
            continue; // Continue to the next iteration of the main loop
        }

        // 2. We have a response with no tool calls. Check if it's a valid final response.
        const textOutput = (response.text ?? '').trim();
        if (textOutput) {
            // Valid final response with text content.
            break; // Exit the loop
        }

        // 3. Handle empty final response
        if (emptyResponseRetries >= MAX_EMPTY_RETRIES) {
            onToolActivity(`Model failed to provide a response after ${MAX_EMPTY_RETRIES} retries. Ending conversation.`);
            // Create a synthetic error message to display to the user
            const syntheticResponseMessage: ChatMessage = {
                role: 'model',
                parts: [{ text: "I'm sorry, but I was unable to generate a final response. This may be due to the API's safety filters or an internal model issue." }],
            };
            return { responseMessage: syntheticResponseMessage };
        }

        emptyResponseRetries++;
        const finishReason = response.candidates?.[0]?.finishReason ?? 'UNKNOWN';
        
        const logMessage = `Model returned an empty response (Reason: \`${finishReason}\`). Retrying for a summary... (${emptyResponseRetries}/${MAX_EMPTY_RETRIES})`;
        onToolActivity(logMessage);
        console.warn(`Empty response received. Finish Reason: ${finishReason}. Full response:`, response);

        // Ask the model to try again and provide a summary.
        response = await sendMessage(chat, {
            message: [{ text: 'Your previous response was empty. Please provide a text summary of your actions.' }]
        }, onToolActivity);
    }
    
    // 4. Construct and return the final valid message
    const finalResponseText = (response.text ?? '').trim();
    const responseMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: finalResponseText }],
    };
    
    return { responseMessage };
}
