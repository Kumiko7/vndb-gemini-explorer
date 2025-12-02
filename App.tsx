
import React, { useState, useCallback } from 'react';
import type { ChatMessage, SidebarItem, ChatPart } from './types';
import { ChatInterface } from './components/ChatInterface';
import { Sidebar } from './components/Sidebar';
import { runGemini } from './services/geminiService';

const getInitialMessage = (): string => {
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('ja')) {
    return "こんにちは！ビジュアルノベルデータベースの探索をお手伝いします。VNやキャラクターなどについて、お気軽にご質問ください。";
  }
  if (lang.startsWith('zh')) {
    return "你好！今天我能如何帮助你探索视觉小说数据库（VNDB）？可以向我询问关于视觉小说、角色等更多信息。";
  }
  return "Hello! How can I help you explore the Visual Novel Database today? Ask me about VNs, characters, and more.";
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // result is "data:image/jpeg;base64,..."
        // we only need the part after the comma
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to read file as base64 string.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};


export default function App() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'model',
      parts: [{ text: getInitialMessage() }],
    },
  ]);
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDataRetrieved = useCallback((newData: SidebarItem[]) => {
    setSidebarItems(prevItems => [...prevItems, ...newData]);
  }, []);

  const handleQuery = useCallback(async (query: string, attachments: File[] = []) => {
    if ((!query.trim() && attachments.length === 0) || isLoading) return;

    setIsLoading(true);
    setSidebarItems([]); // Clear sidebar on new query

    const imageParts: ChatPart[] = await Promise.all(
        attachments.map(async (file) => ({
            inlineData: {
                mimeType: file.type,
                data: await fileToBase64(file),
            },
        }))
    );
    
    // Per Gemini docs, the text part should be last
    const textPart: ChatPart[] = query.trim() ? [{ text: query }] : [];
    const userMessageParts: ChatPart[] = [...imageParts, ...textPart];

    const userMessage: ChatMessage = { role: 'user', parts: userMessageParts };
    const thinkingMessage: ChatMessage = { role: 'model', parts: [], toolLogs: [] };
    
    setChatHistory(prev => [...prev, userMessage, thinkingMessage]);

    const handleToolActivity = (log: string) => {
      setChatHistory(prev => {
        const currentHistory = [...prev];
        const lastMessage = currentHistory[currentHistory.length - 1];
        
        if (lastMessage && lastMessage.role === 'model') {
          const updatedLogs = [...(lastMessage.toolLogs || []), log];
          currentHistory[currentHistory.length - 1] = { ...lastMessage, toolLogs: updatedLogs };
          return currentHistory;
        }
        return prev;
      });
    };

    try {
      const historyForGemini = [...chatHistory, userMessage];
      const { responseMessage } = await runGemini(userMessage, historyForGemini, handleDataRetrieved, handleToolActivity);
      
      setChatHistory(prev => {
        const currentHistory = [...prev];
        const lastMessage = currentHistory[currentHistory.length - 1];
        if (lastMessage && lastMessage.role === 'model') {
          currentHistory[currentHistory.length - 1] = { ...lastMessage, parts: responseMessage.parts };
          return currentHistory;
        }
        return [...prev, responseMessage];
      });
      
    } catch (error) {
      console.error("Error during Gemini interaction:", error);
      let friendlyMessage = "Sorry, I encountered an error. Please check the console for details.";
      if (error instanceof Error && (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED'))) {
        friendlyMessage = "The Gemini API is busy or the rate limit has been reached. This can happen with complex queries. Please try again in a moment.";
      }
      const errorMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: friendlyMessage }],
      };
      
      setChatHistory(prev => {
        const currentHistory = [...prev];
        const lastMessage = currentHistory[currentHistory.length - 1];
        if (lastMessage && lastMessage.role === 'model' && lastMessage.parts.length === 0) {
             currentHistory[currentHistory.length - 1] = { ...lastMessage, parts: errorMessage.parts };
             return currentHistory;
        }
        return [...prev, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, chatHistory, handleDataRetrieved]);

  return (
    <div className="flex h-screen font-sans bg-gray-900 text-gray-200">
      <main className="flex-1 flex flex-col h-screen">
        <header className="p-4 border-b border-gray-700 shadow-md bg-gray-800/50 backdrop-blur-sm">
          <h1 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            VNDB Gemini Explorer
          </h1>
        </header>
        <ChatInterface
          messages={chatHistory}
          onQuery={handleQuery}
          isLoading={isLoading}
        />
      </main>
      <Sidebar items={sidebarItems} />
    </div>
  );
}
