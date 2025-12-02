import React from 'react';
import type { ProducerData } from '../types';

interface ProducerCardProps {
  data: ProducerData;
}

const typeMap = {
  co: 'Company',
  in: 'Individual',
  ng: 'Amateur Group',
};

export const ProducerCard: React.FC<ProducerCardProps> = ({ data }) => {
  const producerType = data.producerType ? typeMap[data.producerType] : 'Unknown';
  return (
    <a
      href={`https://vndb.org/${data.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 p-4 transition-all transform hover:scale-105 hover:border-yellow-500 duration-300 text-white no-underline"
      aria-label={`View details for producer ${data.name}`}
    >
      <h3 className="font-bold text-lg text-yellow-400">{data.name}</h3>
      <p className="text-sm text-gray-400 mt-1">ID: {data.id}</p>
      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-300">
        <span className="px-2 py-1 bg-gray-700 text-xs rounded-full">{producerType}</span>
        {data.lang && <span className="px-2 py-1 bg-gray-700 text-xs rounded-full">Lang: {data.lang.toUpperCase()}</span>}
      </div>
      {data.description && (
        <p className="text-gray-300 mt-2 text-sm max-h-24 overflow-y-auto">
          {data.description.replace(/\[url=.*?\]|\[\/url\]/g, '')}
        </p>
      )}
    </a>
  );
};