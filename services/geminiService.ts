import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set in the environment.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProductDescription = async (name: string, category: string): Promise<string> => {
  const client = getClient();
  if (!client) return "Error: API Key missing.";

  try {
    const prompt = `Write a compelling and professional e-commerce product description for a product named "${name}" in the category "${category}". 
    Keep it under 60 words. Highlight key features and benefits. Do not use markdown formatting like bolding or headers.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate description via AI. Please try again.";
  }
};
