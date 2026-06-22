import { apiClient } from '@/services/apiClient';

export const feesService = {
  listForCase: (caseId) => apiClient.get(`/cases/${caseId}/fees`),
  create: (caseId, data) => apiClient.post(`/cases/${caseId}/fees`, data),
  void: (feeId, voidReason) => apiClient.patch(`/fees/${feeId}`, { voided: true, voidReason }),
};
