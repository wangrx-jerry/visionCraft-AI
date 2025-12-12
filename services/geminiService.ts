import { GoogleGenAI } from "@google/genai";
import { Scenario } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeImage = async (
  base64Image: string,
  mimeType: string,
  scenario: Scenario,
  customInstruction?: string
): Promise<string> => {
  const ai = getClient();
  
  // Clean base64 string if it contains the header
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp|heic);base64,/, '');

  try {
    const finalPrompt = customInstruction || scenario.prompt;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: finalPrompt
          }
        ]
      },
      config: {
        systemInstruction: scenario.systemInstruction,
        temperature: 0.4, // Lower temperature for more accurate extraction
      }
    });

    return response.text || "No text generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};
