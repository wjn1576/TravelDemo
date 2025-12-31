import { GoogleGenAI, Type } from "@google/genai";
import { OrchestratorResponse, Message, ModelConfig } from "../types";

export const AVAILABLE_MODELS: ModelConfig[] = [
  { 
    id: 'gemini-3-flash-preview', 
    name: 'Gemini 3 Flash', 
    provider: 'gemini', 
    modelId: 'gemini-3-flash-preview',
    apiKey: process.env.API_KEY 
  }
];

const ITINERARY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    tripTitle: { type: Type.STRING },
    destination: { type: Type.STRING },
    duration: { type: Type.STRING },
    totalBudgetEstimate: { type: Type.STRING },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING },
          summary: { type: Type.STRING },
          weather: { type: Type.STRING },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING },
                location: { type: Type.STRING },
                cost: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  }
};

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    responseType: { type: Type.STRING },
    replyText: { type: Type.STRING },
    logs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          agent: { type: Type.STRING },
          status: { type: Type.STRING },
          message: { type: Type.STRING }
        }
      }
    },
    itinerary: ITINERARY_SCHEMA
  },
  required: ["responseType", "replyText", "logs"]
};

export const planTrip = async (userRequest: string, history: Message[], modelConfig: ModelConfig): Promise<OrchestratorResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
你是一个名为 "情书与足迹" 的浪漫旅行规划师。
你的回复风格：像写给爱人的情书，温柔、细腻、充满爱。
目的地如果用户没提，可以推荐适合过年的浪漫城市（如大理、哈尔滨、澳门）。
请严格按照 JSON 格式回复。
`;

  try {
    const response = await ai.models.generateContent({
      model: modelConfig.modelId,
      contents: userRequest,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    
    // Safety mapping to ensure all required fields exist
    return {
      responseType: parsed.responseType || "CHAT",
      replyText: parsed.replyText || "亲爱的，我在规划我们的未来时有些入迷了...",
      logs: Array.isArray(parsed.logs) ? parsed.logs : [],
      itinerary: parsed.itinerary || undefined
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      responseType: "CHAT",
      replyText: "亲爱的，我刚才走神了，在想我们的下一个目的地。能再说一次吗？",
      logs: []
    };
  }
};