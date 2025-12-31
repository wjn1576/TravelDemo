
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

/**
 * Defines the various types of specialized agents in the orchestration system
 */
export enum AgentType {
  WEATHER = 'WEATHER',
  TRANSPORT = 'TRANSPORT',
  ROUTE = 'ROUTE',
  ATTRACTION = 'ATTRACTION',
  FOOD = 'FOOD',
  ORCHESTRATOR = 'ORCHESTRATOR',
}

/**
 * Structure for agent activity logs displayed in the UI
 */
export interface AgentLog {
  agent: AgentType;
  status: 'working' | 'completed' | 'error' | string;
  message: string;
  details?: string;
}

/**
 * The structured response returned by the planning orchestrator
 */
export interface OrchestratorResponse {
  responseType: string;
  replyText: string;
  logs: AgentLog[];
  itinerary?: TravelItinerary;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  relatedItinerary?: TravelItinerary;
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: 'gemini';
  modelId: string;
  apiKey?: string;
}
