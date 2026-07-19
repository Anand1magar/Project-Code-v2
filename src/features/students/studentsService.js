import { apiClient } from '@/services/apiClient';

export const studentsService = {
  list: (q = '') => apiClient.get(q ? `/students?q=${encodeURIComponent(q)}` : '/students'),
  get: (id) => apiClient.get(`/students/${id}`),
  create: (data) => apiClient.post('/students', data),
  update: (id, patch) => apiClient.patch(`/students/${id}`, patch),
  remove: (id) => apiClient.del(`/students/${id}`),
  checkDuplicate: (phone, email) => {
    const qs = new URLSearchParams();
    if (phone) qs.set('phone', phone);
    if (email) qs.set('email', email);
    return apiClient.get(`/students/duplicate?${qs.toString()}`);
  },
};
