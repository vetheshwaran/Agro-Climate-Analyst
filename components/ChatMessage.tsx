import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, Role } from '../types';
import { SourceCitation } from './SourceCitation';
import { BotIcon } from './icons/BotIcon';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === Role.MODEL;

  const containerClasses = `flex items-start gap-4 ${isModel ? '' : 'justify-end'}`;
  const messageBoxClasses = `max-w-2xl p-4 rounded-2xl ${
    isModel
      ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-md'
      : 'bg-blue-500 text-white'
  }`;

  return (
    <div className={containerClasses}>
      {isModel && (
        <div className="flex-shrink-0 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <BotIcon />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className={messageBoxClasses}>
          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-li:my-1 prose-table:my-4 prose-headings:my-3">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text}
            </ReactMarkdown>
          </div>
        </div>
        {isModel && message.sources && message.sources.length > 0 && (
          <div className="max-w-2xl px-2">
            <SourceCitation sources={message.sources} />
          </div>
        )}
      </div>
    </div>
  );
};
