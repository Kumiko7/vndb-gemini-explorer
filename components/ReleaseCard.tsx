import React from 'react';
import type { ReleaseData } from '../types';

interface ReleaseCardProps {
  data: ReleaseData;
}

export const ReleaseCard: React.FC<ReleaseCardProps> = ({ data }) => {
  return (
    <a
      href={`https://vndb.org/${data.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 p-4 transition-all transform hover:scale-105 hover:border-blue-500 duration-300 text-white no-underline"
      aria-label={`View details for release ${data.title}`}
    >
        <h3 className="font-bold text-lg text-blue-400">{data.title}</h3>
        <p className="text-sm text-gray-400 mt-1">ID: {data.id}</p>
        {data.released && <p className="text-sm text-gray-400">Released: {data.released}</p>}
        {data.platforms && data.platforms.length > 0 && (
             <div className="mt-2">
                <p className="text-sm font-semibold text-gray-300">Platforms:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                    {data.platforms.map(platform => (
                        <span key={platform} className="px-2 py-1 bg-gray-700 text-xs rounded-full">{platform}</span>
                    ))}
                </div>
            </div>
        )}
    </a>
  );
};
