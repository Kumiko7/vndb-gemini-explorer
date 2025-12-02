import React from 'react';
import type { VnData } from '../types';

interface VnCardProps {
  data: VnData;
}

export const VnCard: React.FC<VnCardProps> = ({ data }) => {
  return (
    <a
      href={`https://vndb.org/${data.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 transition-all transform hover:scale-105 hover:border-purple-500 duration-300 text-white no-underline"
      aria-label={`View details for ${data.title}`}
    >
      <div className="flex-shrink-0 w-32">
        {data.image?.url ? (
          <img src={data.image.url} alt={data.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-center text-gray-500 text-sm p-2">No Image</div>
        )}
      </div>
      <div className="p-4 flex-1">
        <h3 className="font-bold text-lg text-purple-400">{data.title}</h3>
        <p className="text-sm text-gray-400 mt-1">ID: {data.id}</p>
        {data.released && <p className="text-sm text-gray-400">Released: {data.released}</p>}
        {data.rating && <p className="text-sm text-gray-400">Rating: {(data.rating / 10).toFixed(2)}</p>}
        {data.description && (
          <p className="text-gray-300 mt-2 text-sm max-h-24 overflow-y-auto">
            {data.description.replace(/\[url=.*?\]|\[\/url\]/g, '')}
          </p>
        )}
      </div>
    </a>
  );
};
