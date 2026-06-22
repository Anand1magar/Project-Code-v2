import { apiClient } from '@/services/apiClient';

export const documentsService = {
  listForCase: (caseId) => apiClient.get(`/cases/${caseId}/documents`),
  create:  (data)       => apiClient.post('/documents', data),
  update:  (id, patch)  => apiClient.patch(`/documents/${id}`, patch),
};
