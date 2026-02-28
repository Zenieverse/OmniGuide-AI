export enum AppMode {
  APPLIANCE_FIXER = 'appliance_fixer',
  HOMEWORK_TUTOR = 'homework_tutor',
  COOKING_ASSISTANT = 'cooking_assistant',
  GENERAL = 'general'
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

export interface SessionContext {
  id: string;
  mode: AppMode;
  history: { role: 'user' | 'model'; content: string }[];
  lastDetectedObjects?: string[];
}
