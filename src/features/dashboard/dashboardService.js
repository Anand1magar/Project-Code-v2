import { apiClient } from '@/services/apiClient';

export const dashboardService = {
  get: ({ role, userId }) => {
    const qs = new URLSearchParams({ role: role ?? '', userId: userId ?? '' }).toString();
    return apiClient.get(`/dashboard?${qs}`);
  },
};
