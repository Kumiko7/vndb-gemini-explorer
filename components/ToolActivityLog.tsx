import React, { useState } from 'react';

interface ToolActivityLogProps {
  logs: string[];
  isLoading: boolean;
}

export const ToolActivityLog: React.FC<ToolActivityLogProps> = ({ logs, isLoading }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => setIsExpanded(!isExpanded);

  const summary = isLoading ? 'Thinking...' : 'Tool Activity';

  return (
    <div className="bg-gray-800/50 rounded-lg p-3 mb-3 border border-gray-600">
      <button
        onClick={toggleExpansion}
        className="flex justify-between items-center w-full text-left text-sm font-medium text-gray-300 hover:text-white"
        aria-expanded={isExpanded}
        aria-controls="tool-log-details"
      >
        <div className="flex items-center space-x-2">
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400" role="status" aria-label="Loading"></div>
          )}
          {!isLoading && (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0L7.18 7.92c-.11.46-.51.8-1 .8H2.61c-1.61 0-2.32 1.95-1.02 2.92l4.13 3c.36.26.53.73.41 1.18l-1.54 4.7c-.38 1.56 1.25 2.76 2.65 1.88l4.13-3c.36-.26.86-.26 1.22 0l4.13 3c1.4.88 3.03-.32 2.65-1.88l-1.54-4.7c-.12-.45.05-.92.41-1.18l4.13-3c1.3- .97.59-2.92-1.02-2.92h-3.57c-.49 0-.89-.34-1-.8L11.49 3.17z" clipRule="evenodd" />
            </svg>
          )}
          <span>{summary} ({logs.length} step{logs.length === 1 ? '' : 's'})</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isExpanded && (
        <div id="tool-log-details" className="mt-3 pt-3 border-t border-gray-700">
          <ul className="space-y-2 text-xs text-gray-400 max-h-60 overflow-y-auto">
            {logs.map((log, index) => (
              <li key={index} className="font-mono whitespace-pre-wrap">
                <span className="text-gray-500 mr-2">{index + 1}.</span>
                {log}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};