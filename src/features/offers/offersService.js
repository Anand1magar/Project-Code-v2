import { apiClient } from '@/services/apiClient';

export const offersService = {
  listForCase: (caseId) => apiClient.get(`/cases/${caseId}/offers`),
  create: (caseId, data) => apiClient.post(`/cases/${caseId}/offers`, data),
  update: (offerId, patch) => apiClient.patch(`/offers/${offerId}`, patch),
};
