import { apiClient } from '@/services/apiClient';

export const usersService = {
  list: () => apiClient.get('/users'),
  create: (data) => apiClient.post('/users', data),
  update: (id, patch) => apiClient.patch(`/users/${id}`, patch),
};
