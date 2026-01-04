import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export const getGeminiModel = () => {
  if (!apiKey) {
    console.warn("Gemini API Key missing!");
    // Return a dummy object or throw depending on desired behavior. 
    // Ideally we throw so the API route handles it.
    throw new Error("GEMINI_API_KEY is missing");
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
};
