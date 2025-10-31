import { GoogleGenAI } from "@google/genai";
import { Source } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `You are an expert data analyst specializing in Indian governance, agriculture, and climate science. 
Your primary data source is the official Government of India portal, data.gov.in. 
When a user asks a question, you must use your grounding in Google Search to find and analyze the most relevant and up-to-date datasets exclusively from data.gov.in. 
Synthesize information from multiple datasets to provide a comprehensive, accurate answer. 
Format your response using Markdown for clarity (e.g., use tables for comparisons, lists for items).
CRITICAL: You must cite every data point by referencing the title and URL of the source dataset from data.gov.in. List all sources clearly under a 'Sources' heading at the end of your response.`;

export async function runQuery(prompt: string): Promise<{ text: string; sources: Source[] }> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                systemInstruction: {
                    role: "model",
                    parts: [{ text: systemInstruction }],
                },
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources: Source[] = groundingChunks
            .map(chunk => ({
                uri: chunk.web?.uri || '',
                title: chunk.web?.title || 'Untitled Source'
            }))
            .filter(source => source.uri);
        
        // Deduplicate sources based on URI
        const uniqueSources = Array.from(new Map(sources.map(item => [item['uri'], item])).values());

        return { text, sources: uniqueSources };
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while calling the Gemini API.");
    }
}
