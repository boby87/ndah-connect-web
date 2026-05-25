import { environment } from '../../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiUrl,
  useMock: environment.useMock,
  timeout: 30000,
  retryCount: 1,
} as const;

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyOtp: '/auth/verify-otp',
    me: '/auth/me',
  },
  tontines: '/tontines',
  members: '/members',
  sessions: '/sessions',
  contributions: '/contributions',
  distributions: '/distributions',
  loans: '/loans',
  sanctions: '/sanctions',
  documents: '/documents',
  notifications: '/notifications',
  votes: '/votes',
  treasury: '/treasury',
} as const;
