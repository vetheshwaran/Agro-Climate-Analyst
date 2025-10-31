import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { runQuery } from './services/geminiService';
import { Message, Role, Source } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const welcomeMessage: Message = {
    id: 'welcome-message',
    role: Role.MODEL,
    text: `Welcome to the AgroClimate Data-Gov India Analyst.

I can answer complex questions about India's agricultural economy and its relationship with climate patterns, sourcing information directly from the live data.gov.in portal.

Here are some sample questions you can ask:

- *Compare the average annual rainfall in Maharashtra and Karnataka for the last 5 available years. In parallel, list the top 3 most produced food grains in each of those states during the same period, citing all data sources.*
- *Identify the district in Uttar Pradesh with the highest wheat production in the most recent year available.*
- *Analyze the production trend of rice in West Bengal over the last decade and correlate this with rainfall data.*`,
  };
  
  useEffect(() => {
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { id: `user-${Date.now()}`, role: Role.USER, text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const { text: modelText, sources } = await runQuery(text);
      
      const modelMessage: Message = {
        id: `model-${Date.now()}`,
        role: Role.MODEL,
        text: modelText,
        sources: sources,
      };
      setMessages(prev => [...prev, modelMessage]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to get response from the assistant. ${errorMessage}`);
      const modelErrorMessage: Message = {
          id: `error-${Date.now()}`,
          role: Role.MODEL,
          text: `Sorry, I encountered an error. Please try again. \n\nDetails: ${errorMessage}`,
      }
      setMessages(prev => [...prev, modelErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
      <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 font-sans">
          <header className="p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm">
              <h1 className="text-xl font-bold text-center text-gray-800 dark:text-white">
                  AgroClimate Data-Gov India Analyst
              </h1>
          </header>
          <ChatInterface
              messages={messages}
              isLoading={isLoading}
              error={error}
              onSendMessage={handleSendMessage}
          />
      </div>
  );
};

export default App;
