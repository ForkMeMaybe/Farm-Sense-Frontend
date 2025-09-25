import { BaseApiService } from './baseApiService';
import apiClient from './api';

// Interfaces
export interface Farm {
  id: number;
  owner: number;
  name: string;
  location?: string;
}

export interface AMURecord {
  id: number;
  health_record: number;
  drug?: number;
  drug_name?: string;
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
  feed?: number | null;
  quantity_kg: number;
  price_per_kg?: number | null;
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

export interface Labourer {
  id: number;
  user: number;
  farm?: number;
  status: 'pending' | 'approved' | 'rejected';
  user_name: string;
  user_email: string;
  farm_name?: string;
}

export interface AMUInsightResponse {
  insights: string;
}

export interface AMUChartData {
  chart_data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      fill: boolean;
    }>;
  };
  summary: {
    total_treatments: number;
    unique_drugs: number;
    time_period: string;
  };
}

// Farm Service
class FarmService extends BaseApiService<Farm> {
  constructor() {
    super('/api/farms/');
  }

  async createMyFarm(data: { name: string; location?: string }): Promise<Farm> {
    return this.create(data);
  }

  async getMyFarm(): Promise<Farm | null> {
    try {
      const farms = await this.getAll();
      return farms[0] || null;
    } catch (error) {
      return null;
    }
  }
}

// AMU Service
class AMUService extends BaseApiService<AMURecord> {
  constructor() {
    super('/api/amu-records/');
  }

  async getByHealthRecord(healthRecordId: number): Promise<AMURecord[]> {
    return this.getAll({ health_record: healthRecordId });
  }

  async getByLivestock(livestockId: number): Promise<AMURecord[]> {
    return this.getAll({ health_record__livestock: livestockId });
  }

  async generateInsights(livestockId: number): Promise<AMUInsightResponse> {
    const response = await apiClient.post('/api/amu-insights/generate/', {
      livestock_id: livestockId,
    });
    return response.data;
  }

  async getChartData(livestockId: number): Promise<AMUChartData> {
    const response = await apiClient.get('/api/amu-insights/chart-data/', {
      livestock_id: livestockId,
    });
    return response.data;
  }
}

// Drug Service
class DrugService extends BaseApiService<Drug> {
  constructor() {
    super('/api/drugs/');
  }
}

// Feed Service
class FeedService extends BaseApiService<FeedRecord> {
  constructor() {
    super('/api/feed-records/');
  }

  async getByLivestock(livestockId: number): Promise<FeedRecord[]> {
    return this.getAll({ livestock: livestockId });
  }
}

// Yield Service  
class YieldService extends BaseApiService<YieldRecord> {
  constructor() {
    super('/api/yield-records/');
  }

  async getByLivestock(livestockId: number): Promise<YieldRecord[]> {
    return this.getAll({ livestock: livestockId });
  }
}

// Labourer Service
class LabourerService extends BaseApiService<Labourer> {
  constructor() {
    super('/api/labourers/');
  }

  async createProfile(): Promise<Labourer> {
    return this.create({});
  }

  async joinFarm(labourerId: number, farmId: number): Promise<{ detail: string }> {
    const response = await apiClient.post(
      `/api/labourers/${labourerId}/join_farm/`,
      { farm_id: farmId }
    );
    return response.data;
  }

  async approve(labourerId: number): Promise<{ detail: string }> {
    const response = await apiClient.post(`/api/labourers/${labourerId}/approve/`);
    return response.data;
  }

  async reject(labourerId: number): Promise<{ detail: string }> {
    const response = await apiClient.post(`/api/labourers/${labourerId}/reject/`);
    return response.data;
  }

  async getPendingRequests(): Promise<Labourer[]> {
    return this.getAll({ status: 'pending' });
  }

  async getApprovedLabourers(): Promise<Labourer[]> {
    return this.getAll({ status: 'approved' });
  }
}

// Export service instances
export const farmService = new FarmService();
export const amuService = new AMUService();
export const drugService = new DrugService();
export const feedService = new FeedService();
export const yieldService = new YieldService();
export const labourerService = new LabourerService();