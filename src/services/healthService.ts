import { BaseApiService } from './baseApiService';
import apiClient from './api';

export interface AMURecord {
  id: number;
  health_record: number;
  drug?: number;
  drug_name?: string;
  dosage: string;
  withdrawal_period: number;
}

export interface HealthRecord {
  id: number;
  livestock: number;
  event_type: 'vaccination' | 'sickness' | 'check-up' | 'treatment';
  event_date: string;
  notes?: string;
  diagnosis?: string;
  treatment_outcome?: string;
  amu_records: AMURecord[];
}

class HealthRecordService extends BaseApiService<HealthRecord> {
  constructor() {
    super('/api/health-records/');
  }

  async getByLivestock(livestockId: number): Promise<HealthRecord[]> {
    return this.getAll({ livestock: livestockId });
  }

  async getByEventType(eventType: string): Promise<HealthRecord[]> {
    return this.getAll({ event_type: eventType });
  }

  async getRecent(limit: number = 10): Promise<HealthRecord[]> {
    const response = await apiClient.get(this.endpoint, {
      ordering: '-event_date',
      limit,
    });
    return response.data.results || response.data;
  }
}

export default new HealthRecordService();