import { GoogleGenAI, Type } from "@google/genai";
import { AppMode, GeminiResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_INSTRUCTIONS = {
  [AppMode.APPLIANCE_FIXER]: "You are an expert appliance repair technician. Analyze the image and the user's question. Identify components, potential issues, and provide step-by-step guidance. Return structured JSON with 'analysis', 'speech' (what you will say), and 'overlay' (visual markers for the camera feed).",
  [AppMode.HOMEWORK_TUTOR]: "You are a patient and brilliant tutor. Analyze the math or physics problem in the image. Explain the concepts clearly and solve it step-by-step. Return structured JSON with 'analysis', 'speech', and 'overlay' (to point out specific parts of the equation or diagram).",
  [AppMode.COOKING_ASSISTANT]: "You are a world-class chef. Identify the ingredients in the image and suggest recipes or cooking tips. Return structured JSON with 'analysis', 'speech', and 'overlay' (to highlight specific ingredients or tools).",
  [AppMode.GENERAL]: "You are a helpful multimodal AI assistant. Analyze the scene and respond to the user's query. Return structured JSON with 'analysis', 'speech', and 'overlay'."
};

export async function analyzeScene(
  imageData: string,
  userSpeech: string,
  mode: AppMode,
  history: { role: 'user' | 'model'; content: string }[]
): Promise<GeminiResponse> {
  const model = "gemini-2.5-flash"; // Fast and multimodal
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageData.split(',')[1] // Remove data:image/jpeg;base64,
            }
          },
          {
            text: `User says: "${userSpeech}"\n\nCurrent Mode: ${mode}\n\nPrevious context: ${JSON.stringify(history.slice(-5))}`
          }
        ]
      }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS[mode],
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }],
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          speech: { type: Type.STRING },
          overlay: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ['highlight', 'arrow', 'label', 'circle'] },
                x: { type: Type.NUMBER, description: "Normalized X coordinate (0-100)" },
                y: { type: Type.NUMBER, description: "Normalized Y coordinate (0-100)" },
                width: { type: Type.NUMBER, description: "Normalized width (0-100)" },
                height: { type: Type.NUMBER, description: "Normalized height (0-100)" },
                label: { type: Type.STRING },
                color: { type: Type.STRING }
              }
            }
          }
        },
        required: ["analysis", "speech"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as GeminiResponse;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return {
      analysis: "I'm sorry, I couldn't process that correctly.",
      speech: "I'm having trouble understanding the scene right now."
    };
  }
}
