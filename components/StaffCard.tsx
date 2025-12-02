import React from 'react';
import type { StaffData } from '../types';

interface StaffCardProps {
  data: StaffData;
}

export const StaffCard: React.FC<StaffCardProps> = ({ data }) => {
  return (
    <a
      href={`https://vndb.org/${data.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 p-4 transition-all transform hover:scale-105 hover:border-green-500 duration-300 text-white no-underline"
      aria-label={`View details for staff member ${data.name}`}
    >
      <h3 className="font-bold text-lg text-green-400">{data.name}</h3>
      <p className="text-sm text-gray-400 mt-1">ID: {data.id}</p>
      {data.description && (
        <p className="text-gray-300 mt-2 text-sm max-h-24 overflow-y-auto">
          {data.description.replace(/\[url=.*?\]|\[\/url\]/g, '')}
        </p>
      )}
    </a>
  );
};