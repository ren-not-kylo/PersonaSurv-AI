
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface Outcome {
  id: string;
  name: string;
  traits: string[];
}

export interface SurveyTemplate {
  id: string;
  topic: string;
  questionCount: number;
  outcomes: Outcome[];
  createdAt: number;
}

export interface UserProfile {
  id: string;
  name: string;
  interests: string[];
  demographics: string;
  history: Record<string, string>; // templateId -> outcomeName
}

export interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    outcomeId: string;
  }[];
}

export interface SurveyResponse {
  id: string;
  templateId: string;
  userId: string;
  userName: string;
  result: string;
  rating: number;
  timestamp: number;
}
