// API Types
export interface AIRequest {
  image?: string; // base64 encoded image
  text?: string; // user query
  sessionId?: string; // for context continuity
}

export interface AIResponse {
  text: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

// Conversation Types
export interface Message {
  id: string;
  type: 'user' | 'assistant';
  text?: string;
  image?: string; // base64 thumbnail
  timestamp: number;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  preview?: string;
}

// App State Types
export interface AppSettings {
  voiceEnabled: boolean;
  voiceSpeed: number;
  voicePitch: number;
  apiEndpoint: string;
  hapticEnabled: boolean;
}

// Camera Types
export interface CapturedImage {
  uri: string;
  base64: string;
  width: number;
  height: number;
}
