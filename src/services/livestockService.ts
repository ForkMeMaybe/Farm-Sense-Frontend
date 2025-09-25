import { BaseApiService } from './baseApiService';
import apiClient from './api';

export interface Livestock {
  id: number;
  farm: number;
  tag_id: string;
  species: string;
  breed: string;
  date_of_birth: string;
  gender: 'M' | 'F';
  health_status: 'healthy' | 'sick' | 'recovering';
  current_weight_kg?: number;
}

class LivestockService extends BaseApiService<Livestock> {
  constructor() {
    super('/api/livestock/');
  }

  async getByFarm(farmId: number): Promise<Livestock[]> {
    return this.getAll({ farm: farmId });
  }

  async getBySpecies(species: string): Promise<Livestock[]> {
    return this.getAll({ species });
  }

  async getByHealthStatus(status: string): Promise<Livestock[]> {
    return this.getAll({ health_status: status });
  }

  async searchByTagId(tagId: string): Promise<Livestock[]> {
    return this.getAll({ search: tagId });
  }
}

export default new LivestockService();