import React from 'react';
import type { TraitData } from '../types';

interface TraitCardProps {
  data: TraitData;
}

export const TraitCard: React.FC<TraitCardProps> = ({ data }) => {
  return (
    <a
      href={`https://vndb.org/${data.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 p-4 transition-all transform hover:scale-105 hover:border-indigo-500 duration-300 text-white no-underline"
      aria-label={`View details for trait ${data.name}`}
    >
      <h3 className="font-bold text-lg text-indigo-400">{data.name}</h3>
      <p className="text-sm text-gray-400 mt-1">ID: {data.id}</p>
       <div className="mt-2 flex items-center space-x-4 text-sm text-gray-300">
          {data.group_name && <span className="px-2 py-1 bg-gray-700 text-xs rounded-full">Group: {data.group_name}</span>}
          {data.char_count !== undefined && <span className="px-2 py-1 bg-gray-700 text-xs rounded-full">{data.char_count} Chars</span>}
      </div>
      {data.description && (
        <p className="text-gray-300 mt-2 text-sm max-h-24 overflow-y-auto">
          {data.description.replace(/\[url=.*?\]|\[\/url\]/g, '')}
        </p>
      )}
    </a>
  );
};