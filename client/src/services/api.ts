import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  Survey,
  Answer,
  AnalyticsData,
  AuthResponse,
  User,
  DraftResponse,
  SurveyVersion
} from '../types/index';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://survey-builder-app.onrender.com' : '')) + '/api/';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface SubmitResponsePayload {
  answers: Answer[];
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export const surveyApi = {
  getAllSurveys: (): Promise<AxiosResponse<Survey[]>> => api.get('surveys'),
  getSurveyById: (id: string): Promise<AxiosResponse<Survey>> => api.get(`surveys/${id}`),
  createSurvey: (data: Partial<Survey>): Promise<AxiosResponse<Survey>> =>
    api.post('surveys', data),
  updateSurvey: (id: string, data: Partial<Survey>): Promise<AxiosResponse<Survey>> =>
    api.put(`surveys/${id}`, data),
  deleteSurvey: (id: string): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`surveys/${id}`)
};

export const responseApi = {
  submitResponse: (
    surveyId: string,
    data: SubmitResponsePayload
  ): Promise<AxiosResponse> => api.post(`surveys/${surveyId}/responses`, data),
  getResponses: (surveyId: string): Promise<AxiosResponse> =>
    api.get(`surveys/${surveyId}/responses`)
};

export const analyticsApi = {
  getAnalytics: (surveyId: string): Promise<AxiosResponse<AnalyticsData>> =>
    api.get(`surveys/${surveyId}/analytics`)
};

export const authApi = {
  register: (data: RegisterPayload): Promise<AxiosResponse<AuthResponse>> =>
    api.post('auth/register', data),
  login: (data: LoginPayload): Promise<AxiosResponse<AuthResponse>> =>
    api.post('auth/login', data),
  getProfile: (): Promise<AxiosResponse<{ user: User }>> => api.get('auth/profile')
};

export const draftApi = {
  saveDraft: (surveyId: string, answers: Answer[]): Promise<AxiosResponse<DraftResponse>> =>
    api.post(`surveys/${surveyId}/drafts`, { answers }),
  getDraft: (surveyId: string): Promise<AxiosResponse<{ draft: DraftResponse }>> =>
    api.get(`surveys/${surveyId}/drafts`),
  deleteDraft: (surveyId: string): Promise<AxiosResponse> =>
    api.delete(`surveys/${surveyId}/drafts`)
};

export const versionApi = {
  getVersions: (surveyId: string): Promise<AxiosResponse<SurveyVersion[]>> =>
    api.get(`surveys/${surveyId}/versions`),
  restoreVersion: (
    surveyId: string,
    versionId: string
  ): Promise<AxiosResponse<{ message: string; survey: Survey }>> =>
    api.post(`surveys/${surveyId}/versions/${versionId}/restore`)
};

export default api;
