import React from 'react';
import type { QuoteData } from '../types';

interface QuoteCardProps {
  data: QuoteData;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ data }) => {
  return (
    <div
      className="block bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 p-4 transition-colors duration-300"
      aria-label={`Quote by ${data.character?.name || 'Unknown'}`}
    >
      <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-300">
        <a href={`https://vndb.org/${data.id}`} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
            "{data.quote}"
        </a>
      </blockquote>
      <div className="mt-3 text-right text-sm">
        {data.character?.name && (
            <a href={`https://vndb.org/${data.character.id}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-400 hover:underline">
                — {data.character.name}
            </a>
        )}
        {data.vn?.title && (
             <span className="text-gray-400">, from </span>
        )}
        {data.vn?.title && (
            <a href={`https://vndb.org/${data.vn.id}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-400 hover:underline">
               {data.vn.title}
            </a>
        )}
      </div>
    </div>
  );
};