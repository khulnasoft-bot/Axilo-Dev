export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  title?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface AgentRequest {
  conversationId?: string;
  messages: Message[];
  model?: string;
  tools?: string[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AgentResponse {
  conversationId: string;
  message: Message;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: string;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
}

export interface ToolResult {
  success: boolean;
  result?: any;
  error?: string;
  metadata?: Record<string, any>;
}

export interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  enabled: boolean;
  permissions: string[];
  config?: Record<string, any>;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
  id?: string;
}

export interface ErrorResponse {
  error: string;
  code: string;
  details?: any;
}
