export enum Tone {
  BUILDER = 'Builder',
  STUDENT = 'Student',
  FOUNDER = 'Founder',
}

export interface OptimizedPost {
  headline: string;
  content: string;
  tags: string[];
  toneExplanation: string;
}

export interface GenerationResult {
  original: string;
  tone: Tone;
  versions: OptimizedPost[];
}

export interface ScheduledPost extends OptimizedPost {
  id: string;
  scheduledDate: string; // ISO Date string
}

export type ViewMode = 'generator' | 'analytics' | 'calendar';
