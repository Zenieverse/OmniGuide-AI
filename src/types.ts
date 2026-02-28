export enum AppMode {
  APPLIANCE_FIXER = 'appliance_fixer',
  HOMEWORK_TUTOR = 'homework_tutor',
  COOKING_ASSISTANT = 'cooking_assistant',
  GENERAL = 'general'
}

export enum AgentStatus {
  IDLE = 'idle',
  LISTENING = 'listening',
  THINKING = 'thinking',
  SPEAKING = 'speaking',
  ERROR = 'error'
}

export interface OverlayInstruction {
  type: 'highlight' | 'arrow' | 'label' | 'circle';
  target?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  label?: string;
  color?: string;
}

export interface GeminiResponse {
  analysis: string;
  speech: string;
  overlay?: OverlayInstruction[];
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  mode: AppMode;
  image?: string;
}

export interface SessionContext {
  id: string;
  mode: AppMode;
  history: Message[];
  lastDetectedObjects?: string[];
}

export interface AppSettings {
  voiceEnabled: boolean;
  autoAnalyze: boolean;
  cameraResolution: '720p' | '1080p';
}
