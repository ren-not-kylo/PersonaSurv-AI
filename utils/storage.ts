
import { SurveyTemplate, UserProfile, SurveyResponse, UserRole } from "../types";

const KEYS = {
  TEMPLATES: 'ps_templates',
  USER: 'ps_user_profile',
  RESPONSES: 'ps_responses',
  SESSION_ROLE: 'ps_session_role'
};

const DEFAULT_USER: UserProfile = {
  id: 'user-1',
  name: 'Alex Johnson',
  interests: ['Technology', 'Fantasy Novels', 'Hiking'],
  demographics: '30-year-old software engineer living in Seattle',
  history: {}
};

export const getTemplates = (): SurveyTemplate[] => {
  const data = localStorage.getItem(KEYS.TEMPLATES);
  return data ? JSON.parse(data) : [];
};

export const saveTemplate = (template: SurveyTemplate) => {
  const templates = getTemplates();
  localStorage.setItem(KEYS.TEMPLATES, JSON.stringify([...templates, template]));
};

export const getUser = (): UserProfile => {
  const data = localStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : DEFAULT_USER;
};

export const saveUser = (user: UserProfile) => {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const getResponses = (): SurveyResponse[] => {
  const data = localStorage.getItem(KEYS.RESPONSES);
  return data ? JSON.parse(data) : [];
};

export const saveResponse = (response: SurveyResponse) => {
  const responses = getResponses();
  localStorage.setItem(KEYS.RESPONSES, JSON.stringify([...responses, response]));
};

export const getSessionRole = (): UserRole | null => {
  return localStorage.getItem(KEYS.SESSION_ROLE) as UserRole | null;
};

export const setSessionRole = (role: UserRole | null) => {
  if (role) {
    localStorage.setItem(KEYS.SESSION_ROLE, role);
  } else {
    localStorage.removeItem(KEYS.SESSION_ROLE);
  }
};
