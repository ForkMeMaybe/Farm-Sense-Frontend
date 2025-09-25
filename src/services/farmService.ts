import api from './api';

export interface AMURecord {
    id: number;
    health_record: number;
    drug: number;
    drug_name: string;
    dosage: string;
    withdrawal_period: number;
}

export interface Drug {
    id: number;
    name: string;
    active_ingredient?: string;
    species_target?: string;
    recommended_dosage_min?: number;
    recommended_dosage_max?: number;
    unit?: string;
    notes?: string;
}

export interface FeedRecord {
    id: number;
    livestock: number;
    feed_type: string;
    quantity_kg: number;
    date: string;
}

export interface YieldRecord {
    id: number;
    livestock: number;
    yield_type: string;
    quantity: number;
    unit: string;
    date: string;
}

export const amuService = {
    // AMU Records
    getAMURecords: () => api.get('/api/amu-records/'),
    getAMURecordById: (id: number) => api.get(`/api/amu-records/${id}/`),
    createAMURecord: (data: Omit<AMURecord, 'id'>) => api.post('/api/amu-records/', data),
    updateAMURecord: (id: number, data: Partial<AMURecord>) =>
        api.put(`/api/amu-records/${id}/`, data),
    deleteAMURecord: (id: number) => api.delete(`/api/amu-records/${id}/`),

    // AI Insights
    generateAMUInsights: (livestockId: number) =>
        api.post('/api/amu-insights/generate/', { livestock_id: livestockId }),
};

export const drugService = {
    getAll: () => api.get('/api/drugs/'),
    getById: (id: number) => api.get(`/api/drugs/${id}/`),
    create: (data: Omit<Drug, 'id'>) => api.post('/api/drugs/', data),
    update: (id: number, data: Partial<Drug>) =>
        api.put(`/api/drugs/${id}/`, data),
    delete: (id: number) => api.delete(`/api/drugs/${id}/`),
};

export const feedService = {
    getAll: () => api.get('/api/feed-records/'),
    getById: (id: number) => api.get(`/api/feed-records/${id}/`),
    create: (data: Omit<FeedRecord, 'id'>) => api.post('/api/feed-records/', data),
    update: (id: number, data: Partial<FeedRecord>) =>
        api.put(`/api/feed-records/${id}/`, data),
    delete: (id: number) => api.delete(`/api/feed-records/${id}/`),
    getByLivestock: (livestockId: number) =>
        api.get(`/api/feed-records/?livestock=${livestockId}`),
};

export const yieldService = {
    getAll: () => api.get('/api/yield-records/'),
    getById: (id: number) => api.get(`/api/yield-records/${id}/`),
    create: (data: Omit<YieldRecord, 'id'>) => api.post('/api/yield-records/', data),
    update: (id: number, data: Partial<YieldRecord>) =>
        api.put(`/api/yield-records/${id}/`, data),
    delete: (id: number) => api.delete(`/api/yield-records/${id}/`),
    getByLivestock: (livestockId: number) =>
        api.get(`/api/yield-records/?livestock=${livestockId}`),
};

export const farmService = {
    getAll: () => api.get('/api/farms/'),
    getById: (id: number) => api.get(`/api/farms/${id}/`),
    create: (data: { name: string; location?: string }) => api.post('/api/farms/', data),
    update: (id: number, data: Partial<{ name: string; location?: string }>) =>
        api.put(`/api/farms/${id}/`, data),
    delete: (id: number) => api.delete(`/api/farms/${id}/`),
};

export const labourerService = {
    getAll: () => api.get('/api/labourers/'),
    getById: (id: number) => api.get(`/api/labourers/${id}/`),
    create: (data: { farm?: number }) => api.post('/api/labourers/', data),
    update: (id: number, data: { farm?: number; status?: 'pending' | 'approved' | 'rejected' }) =>
        api.put(`/api/labourers/${id}/`, data),
    delete: (id: number) => api.delete(`/api/labourers/${id}/`),
};