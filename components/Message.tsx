import React from 'react';
import { marked } from 'marked';
import type { ChatMessage } from '../types';
import { ToolActivityLog } from './ToolActivityLog';

interface MessageProps {
  message: ChatMessage;
  isLoading: boolean;
  isLastMessage: boolean;
}

export const Message: React.FC<MessageProps> = ({ message, isLoading, isLastMessage }) => {
  const isUser = message.role === 'user';
  
  const textContent = message.parts.filter(p => p.text).map(p => p.text).join('');
  const imageParts = message.parts.filter(p => p.inlineData);
  
  const parsedContent = isUser ? null : marked(textContent);

  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-purple-600 text-white'
    : 'bg-gray-700 text-gray-200';

  const Icon = isUser ? UserIcon : GeminiIcon;

  const showToolLogs = message.toolLogs && message.toolLogs.length > 0;
  const isThinking = isLoading && isLastMessage && !textContent.trim();

  return (
    <div className={`max-w-3xl w-full mx-auto flex items-start gap-4 ${containerClasses}`}>
      {!isUser && <Icon />}
      <div className={`p-4 rounded-lg shadow-md ${bubbleClasses}`}>
        {showToolLogs && <ToolActivityLog logs={message.toolLogs} isLoading={isThinking} />}

        {imageParts.length > 0 && (
          <div className={`flex flex-wrap gap-2 ${textContent ? 'mb-2' : ''}`}>
            {imageParts.map((part, index) => (
              <img
                key={index}
                src={`data:${part.inlineData!.mimeType};base64,${part.inlineData!.data}`}
                alt={`attachment ${index}`}
                className="max-w-xs max-h-48 object-contain rounded-lg border border-gray-500"
              />
            ))}
          </div>
        )}

        {textContent.trim() ? (
            isUser ? (
            <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {textContent}
            </div>
            ) : (
            <div
                className="prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: parsedContent as string }}
            />
            )
        ) : null}
      </div>
       {isUser && <Icon />}
    </div>
  );
};

const UserIcon = () => (
  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  </div>
);

const GeminiIcon = () => (
  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  </div>
);
