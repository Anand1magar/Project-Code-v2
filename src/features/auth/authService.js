import { apiClient } from '@/services/apiClient';

export const authService = {
  login: ({ email, role }) => apiClient.post('/auth/login', { email, role }),
  me: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
};
