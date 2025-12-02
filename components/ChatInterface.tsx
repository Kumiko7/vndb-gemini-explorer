import React from 'react';
import type { ChatMessage } from '../types';
import { Message } from './Message';
import { QueryInput } from './QueryInput';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onQuery: (query: string, attachments: File[]) => void;
  isLoading: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onQuery, isLoading }) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <Message
            key={index}
            message={msg}
            isLoading={isLoading}
            isLastMessage={index === messages.length - 1}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700 bg-gray-800/70">
        <QueryInput onSubmit={onQuery} isLoading={isLoading} />
      </div>
    </div>
  );
};
