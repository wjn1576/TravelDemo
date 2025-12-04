export enum AgentType {
  ORCHESTRATOR = 'Orchestrator',
  WEATHER = 'Weather',
  TRANSPORT = 'Transport',
  ROUTE = 'Route',
  ATTRACTION = 'Attraction',
  FOOD = 'Food',
}

export interface AgentLog {
  agent: AgentType;
  status: 'pending' | 'working' | 'completed' | 'failed';
  message: string;
  details?: string;
}

export interface TravelActivity {
  time: string;
  title: string;
  description: string;
  type: 'transport' | 'attraction' | 'food' | 'rest';
  location?: string;
  cost?: string;
}

export interface DayPlan {
  date: string;
  summary: string;
  weather: string;
  activities: TravelActivity[];
}

export interface TravelItinerary {
  tripTitle: string;
  destination: string;
  duration: string;
  totalBudgetEstimate: string;
  days: DayPlan[];
}

// New types for intent handling
export type ResponseType = 'CHAT' | 'SPECIFIC' | 'PLAN';

export interface OrchestratorResponse {
  responseType: ResponseType;
  replyText: string; // The natural language conversational reply
  logs: AgentLog[];
  itinerary?: TravelItinerary; // Optional, only present if type is PLAN
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  relatedItinerary?: TravelItinerary;
  agentLogs?: AgentLog[];
}

export type ModelProvider = 'gemini' | 'openai-compatible';

export interface ModelConfig {
  id: string;
  name: string;
  provider: ModelProvider;
  modelId: string;
  baseUrl?: string;
  apiKey?: string;
}