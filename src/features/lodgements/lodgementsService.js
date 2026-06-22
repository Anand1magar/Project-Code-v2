import { apiClient } from '@/services/apiClient';

export const lodgementsService = {
  getForCase: (caseId) => apiClient.get(`/cases/${caseId}/lodgement`),
  create: (caseId, data) => apiClient.post(`/cases/${caseId}/lodgement`, data),
  recordDecision: (caseId, data) => apiClient.patch(`/cases/${caseId}/decision`, data),
  updateVisaStatus: (caseId, visaStatus) => apiClient.patch(`/cases/${caseId}/visa-status`, { visaStatus }),
};
