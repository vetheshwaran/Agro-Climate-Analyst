import React from 'react';
import { Source } from '../types';

interface SourceCitationProps {
  sources: Source[];
}

export const SourceCitation: React.FC<SourceCitationProps> = ({ sources }) => {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Sources:</h4>
      <ul className="space-y-2">
        {sources.map((source, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">&#8226;</span>
            <a
              href={source.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline break-all"
            >
              {source.title || source.uri}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
