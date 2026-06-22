import { apiClient } from '@/services/apiClient';

export const casesService = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiClient.get(qs ? `/cases?${qs}` : '/cases');
  },
  get: (id) => apiClient.get(`/cases/${id}`),
  create: (data) => apiClient.post('/cases', data),
  update: (id, patch) => apiClient.patch(`/cases/${id}`, patch),
  updateStage: (id, stage) => apiClient.patch(`/cases/${id}/stage`, { stage }),
  updateVisaStatus: (id, visaStatus) => apiClient.patch(`/cases/${id}/visa-status`, { visaStatus }),
  recordDecision: (id, data) => apiClient.patch(`/cases/${id}/decision`, data),
};
