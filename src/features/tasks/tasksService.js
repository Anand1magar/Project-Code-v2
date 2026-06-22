import { apiClient } from '@/services/apiClient';

export const tasksService = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiClient.get(qs ? `/tasks?${qs}` : '/tasks');
  },
  create: (data) => apiClient.post('/tasks', data),
  update: (id, patch) => apiClient.patch(`/tasks/${id}`, patch),
};
