import { GoogleGenAI, Type } from "@google/genai";
import { AgentType, AgentLog, TravelItinerary, OrchestratorResponse, Message, ModelConfig } from "../types";

// Configuration for available models
export const AVAILABLE_MODELS: ModelConfig[] = [
  { 
    id: 'gemini-2.5-flash', 
    name: 'Gemini 2.5 Flash', 
    provider: 'gemini', 
    modelId: 'gemini-2.5-flash',
    apiKey: process.env.API_KEY 
  },
  { 
    id: 'deepseek-v3', 
    name: 'DeepSeek V3', 
    provider: 'openai-compatible', 
    modelId: 'deepseek-chat',
    baseUrl: 'https://api.deepseek.com',
    apiKey: 'sk-bbe9f7fd4b014342ba12bd1733c3b1f8'
  },
  { 
    id: 'glm-4', 
    name: 'GLM-4 (Zhipu)', 
    provider: 'openai-compatible', 
    modelId: 'glm-4',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: '1f51f8387042406b9b0ea196d9fd31bf.fiWr2byeHKYLene8'
  },
  { 
    id: 'qwen-plus', 
    name: 'Qwen Plus (Aliyun)', 
    provider: 'openai-compatible', 
    modelId: 'qwen-plus',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: 'sk-78259320ad1e4bd1a2fbdf873322c118'
  }
];

// Reusable Schema Definition (for System Prompt text injection)
const RESPONSE_SCHEMA_TEXT = `
{
  "responseType": "CHAT" | "SPECIFIC" | "PLAN",
  "replyText": "给用户的直接回复文本",
  "agentLogs": [
    {
      "agent": "Orchestrator" | "Weather" | "Transport" | "Route" | "Attraction" | "Food",
      "status": "completed",
      "message": "简短描述",
      "details": "详细信息"
    }
  ],
  "itinerary": {
    "tripTitle": "string",
    "destination": "string",
    "duration": "string",
    "totalBudgetEstimate": "string",
    "days": [
      {
        "date": "string",
        "summary": "string",
        "weather": "string",
        "activities": [
          {
            "time": "string",
            "title": "string",
            "description": "string",
            "type": "transport" | "attraction" | "food" | "rest",
            "location": "string",
            "cost": "string"
          }
        ]
      }
    ]
  }
}
`;

// Helper to get dynamic prompt
const getSystemInstruction = () => {
  const now = new Date();
  const timeString = now.toLocaleString('zh-CN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return `
你是一个智能旅行规划系统的 "Orchestrator Agent"（总控智能体）。
你的核心能力是：意图识别、上下文理解、多智能体调度。
**关键设定：你不需要等待真实API返回，你需要基于逻辑和常识直接“模拟”出API的返回结果，并呈现给用户。**

### ⚠️ 重要上下文信息 ⚠️
- **当前系统时间**: ${timeString}
- **时间推断**: 用户如果说“明天”、“后天”，必须基于当前系统时间推算具体的日期。
- **地理位置**: 如果用户未提供当前位置（出发地），且任务需要该信息（如“查附近的咖啡馆”或“去上海怎么走”），你**不知道**用户在哪里。

### 1. 意图分类与处理逻辑 (必须严格遵守)

**类型 A: CHAT (闲聊 / 澄清 / 拒绝)**
- 场景：打招呼、表达心情、或者**信息缺失无法执行任务**。
- **反幻觉规则 (CRITICAL)**: 
  - 如果用户输入 "到上海"、"去北京" (暗示移动)，且对话历史中**没有**提到出发地：
    - ❌ 禁止生成行程 (PLAN)。
    - ❌ 禁止默认用户在北京。
    - ✅ 必须设为 CHAT，并回复："请问您计划从哪里出发前往上海？"
  - 区分 "到/去 [地名]" (Transport意图) 和 "在 [地名] 玩" (Itinerary意图)。前者必须有出发地，后者可以直接规划。

**类型 B: SPECIFIC (单项任务)**
- 用户查询特定信息（如"北京明天天气如何"、"上海到杭州的车票"）。
- 行为：**仅调用相关的 1 个或 2 个子智能体**。
- **核心要求：禁止回复“正在查询”、“请稍候”。你必须直接给出“查询结果”。**
- 你需要假装 Agent 已经执行完毕，并编造合理的真实数据（如车次 G123, 价格 500元, 气温 25度）。
- 如果涉及相对时间（如“明天”），必须明确指出是哪一天（如 10月25日）。
- 输出：
  1. 生成 agentLogs 模拟调用过程 (status: completed)。
  2. **replyText**: 必须包含具体的模拟数据。
- itinerary: 必须为 null。

**类型 C: PLAN (行程规划)**
- 用户希望规划一次旅行（如"帮我安排去成都的三天行程"、"在西湖玩一天"）。
- 前置条件：必须明确 **目的地**。如果是跨城旅行，最好知道 **出发地**（用于规划第一段交通），如果不知道出发地但意图是“游玩攻略”，则假设用户已到达目的地，仅规划当地行程。
- 行为：**协调所有相关的子智能体** (Weather, Transport, Route, Attraction, Food) 并行工作。
- 输出：生成详细的调用日志，并生成结构化的 'itinerary' 对象。
- replyText: 简要总结行程亮点。

### 3. 可用子智能体
1. Weather Agent: 查天气 (需指定城市和日期)。
2. Transport Agent: 查交通 (需出发地和目的地)。
3. Route Agent: 查路线/地理位置。
4. Attraction Agent: 查景点。
5. Food Agent: 查美食。

### 输出格式要求
- 必须严格返回 **JSON** 格式。
- 语言必须是 **简体中文**。
- **replyText 字段不能为空**。
`;
};

// Gemini Specific Schema (Type Object)
const GEMINI_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    responseType: { type: Type.STRING, enum: ['CHAT', 'SPECIFIC', 'PLAN'] },
    replyText: { type: Type.STRING },
    agentLogs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          agent: { type: Type.STRING, enum: Object.values(AgentType) },
          status: { type: Type.STRING, enum: ['completed'] },
          message: { type: Type.STRING },
          details: { type: Type.STRING }
        },
        required: ["agent", "status", "message"]
      }
    },
    itinerary: {
      type: Type.OBJECT,
      nullable: true, 
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
                    type: { type: Type.STRING, enum: ['transport', 'attraction', 'food', 'rest'] },
                    location: { type: Type.STRING },
                    cost: { type: Type.STRING }
                  },
                  required: ["time", "title", "type"]
                }
              }
            },
            required: ["date", "activities"]
          }
        }
      },
      required: ["tripTitle", "destination", "days"]
    }
  },
  required: ["responseType", "replyText", "agentLogs"]
};

// --- Execution Logic ---

export const planTrip = async (
  userRequest: string, 
  history: Message[],
  modelConfig: ModelConfig
): Promise<OrchestratorResponse> => {
  try {
    // Context Construction
    const recentHistory = history.slice(-10).map(msg => 
      `${msg.role === 'user' ? '用户' : '你'}: ${msg.content}`
    ).join('\n');

    const promptContext = `
=== 对话历史 (Context) ===
${recentHistory}

=== 当前用户输入 ===
${userRequest}
`;

    let resultText = "";
    // Get dynamic instruction with current time
    const dynamicSystemInstruction = getSystemInstruction();

    // STRATEGY A: Google Gemini SDK
    if (modelConfig.provider === 'gemini') {
      const ai = new GoogleGenAI({ apiKey: modelConfig.apiKey || process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: modelConfig.modelId,
        contents: promptContext,
        config: {
          systemInstruction: dynamicSystemInstruction,
          responseMimeType: "application/json",
          responseSchema: GEMINI_SCHEMA
        }
      });
      resultText = response.text || "";
    } 
    
    // STRATEGY B: OpenAI Compatible (DeepSeek, GLM, Qwen)
    else {
      // For generic LLMs, we append the schema to the system prompt to enforce structure
      const systemPromptWithSchema = `
${dynamicSystemInstruction}

IMPORTANT: You MUST return strictly valid JSON matching the schema below. Do not wrap in markdown code blocks.
${RESPONSE_SCHEMA_TEXT}
      `;

      const response = await fetch(`${modelConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${modelConfig.apiKey}`
        },
        body: JSON.stringify({
          model: modelConfig.modelId,
          messages: [
            { role: 'system', content: systemPromptWithSchema },
            { role: 'user', content: promptContext }
          ],
          response_format: { type: 'json_object' }, // Enforce JSON mode
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Provider API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      resultText = data.choices?.[0]?.message?.content || "";
    }

    // --- Parsing Logic (Shared) ---
    if (!resultText) throw new Error("No response from AI");
    
    // Clean markdown code blocks if present (DeepSeek/Qwen sometimes add them even in json mode)
    const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '').trim();

    let result;
    try {
        result = JSON.parse(cleanJson);
    } catch (e) {
        console.error("JSON Parse Error", resultText);
        return {
            responseType: 'CHAT',
            replyText: `解析失败 (Raw: ${resultText.substring(0, 50)}...)`, 
            logs: []
        };
    }

    // Safe Check
    if (!result.replyText || result.replyText.trim() === "") {
        if (result.responseType === 'PLAN') {
            result.replyText = `已为您生成前往 ${result.itinerary?.destination || '该地'} 的行程。`;
        } else {
            result.replyText = "任务执行完毕。";
        }
    }

    return {
      responseType: result.responseType || 'CHAT',
      replyText: result.replyText,
      logs: result.agentLogs || [],
      itinerary: result.itinerary
    };

  } catch (error) {
    console.error("Orchestration failed:", error);
    return {
        responseType: 'CHAT',
        replyText: `服务暂时不可用 (${modelConfig.name})。请检查网络或Key配额。`,
        logs: []
    };
  }
};