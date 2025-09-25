import api from './api';
import { Livestock } from '../store/slices/livestockSlice';

export const livestockService = {
  getAll: () => api.get('/api/livestock/'),
  getById: (id: number) => api.get(`/api/livestock/${id}/`),
  create: (data: Omit<Livestock, 'id'>) => api.post('/api/livestock/', data),
  update: (id: number, data: Partial<Livestock>) => 
    api.put(`/api/livestock/${id}/`, data),
  delete: (id: number) => api.delete(`/api/livestock/${id}/`),
};