export interface ChatbotConfig {
  apiUrl: string;
  companyName: string;
  primaryColor: string;
  textColor: string;
  position: 'bottom-right' | 'bottom-left';
  enableGlow: boolean;
  enableSound: boolean;
  enablePulse: boolean;
  initialDelay: number;
  reminderInterval: number;
  maxReminders: number;
  pollingInterval: number;
}

export interface ChatbotMessage {
  id: string;
  content: string;
  sender_type: 'customer' | 'assistant' | 'system';
  created_at: string;
}

export interface ChatbotThread {
  thread_id: string;
  session_id: string;
  status: 'open' | 'closed';
}

export interface ChatbotSession {
  session_id: string;
  device_id: string;
  created_at: string;
}

export interface ChatbotApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatbotWebSocketMessage {
  type: 'connect' | 'message' | 'ping' | 'pong' | 'thread_status_update';
  thread_id?: string;
  content?: string;
  sender_type?: 'customer' | 'assistant' | 'system';
  created_at?: string;
  id?: string;
  status?: 'open' | 'closed';
  timestamp?: string;
}

export interface ChatbotEngagementSettings {
  enableGlow: boolean;
  enableSound: boolean;
  enablePulse: boolean;
  initialDelay: number;
  reminderInterval: number;
  maxReminders: number;
}

export interface ChatbotWidgetState {
  isInitialized: boolean;
  isOpen: boolean;
  isConnected: boolean;
  messageCount: number;
  threadId: string | null;
  sessionId: string | null;
}

// Declaraciones globales para el widget
declare global {
  interface Window {
    ChatbotNexusWidget: {
      init: (config: ChatbotConfig) => void;
      enableEngagement: (enabled: boolean) => void;
      clearCues: () => void;
      testAudio: () => void;
      toggleWidget?: () => void;
      addMessageToUI?: (role: string, content: string, timestamp: string, messageId: string) => boolean;
    };
  }
}
