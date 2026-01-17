
import { GoogleGenAI, Type } from "@google/genai";
import { MotivationalQuote } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchDailyMotivation = async (taskCount: number): Promise<MotivationalQuote> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a high-impact, short motivational quote for someone who has ${taskCount} tasks to do today. Return as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING },
            author: { type: Type.STRING }
          },
          required: ["quote", "author"]
        }
      }
    });
    
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error fetching motivation:", error);
    return {
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    };
  }
};
