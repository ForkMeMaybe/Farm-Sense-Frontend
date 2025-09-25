import api from './api';
import { HealthRecord } from '../store/slices/healthSlice';

export const healthService = {
  getAll: () => api.get('/api/health-records/'),
  getById: (id: number) => api.get(`/api/health-records/${id}/`),
  create: (data: Omit<HealthRecord, 'id'>) => api.post('/api/health-records/', data),
  update: (id: number, data: Partial<HealthRecord>) => 
    api.put(`/api/health-records/${id}/`, data),
  delete: (id: number) => api.delete(`/api/health-records/${id}/`),
};