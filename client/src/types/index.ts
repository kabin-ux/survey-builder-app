export interface ConditionalLogic {
  dependsOn?: string;
  showWhen?: string;
}

export interface Question {
  id: string;
  type: 'text' | 'multiple_choice' | 'checkbox' | 'rating';
  text: string;
  required: boolean;
  options: string[];
  conditionalLogic?: ConditionalLogic;
  order?: number;
}

export interface Survey {
  _id: string;
  title: string;
  description?: string;
  isActive: boolean;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  questionId: string;
  value: string | string[] | number;
}

export interface OptionStats {
  option: string;
  count: number;
}

export interface RatingDistribution {
  [key: number]: number;
}

export interface QuestionAnalytics {
  id: string;
  type: string;
  text: string;
  responses?: string[];
  options?: OptionStats[];
  average?: number;
  distribution?: RatingDistribution;
  totalRatings?: number;
}

export interface AnalyticsData {
  surveyId: string;
  totalResponses: number;
  questions: {
    [key: string]: QuestionAnalytics;
  };
}

export interface FormDataState {
  title: string;
  description: string;
  questions: Question[];
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface DraftResponse {
  id: string;
  answers: Answer[];
  lastSavedAt: string;
}

export interface SurveyVersion {
  _id: string;
  surveyId: string;
  version: number;
  title: string;
  description?: string;
  questions: Question[];
  changedBy: string;
  changeDescription?: string;
  createdAt: string;
  updatedAt: string;
}
