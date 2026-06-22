import { apiClient } from '@/services/apiClient';

export const activityService = {
  listForCase: (caseId) => apiClient.get(`/cases/${caseId}/activity`),
  create: (data) => apiClient.post('/activity', data),
};
