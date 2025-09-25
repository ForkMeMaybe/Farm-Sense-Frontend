import apiClient from './api';
import { AxiosResponse } from 'axios';

export interface PaginatedResponse<T> {
  count?: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export class BaseApiService<T> {
  constructor(private endpoint: string) {}

  async getAll(params?: any): Promise<T[]> {
    const response: AxiosResponse<any> = await apiClient.get(this.endpoint, params);
    const data = response.data;
    if (Array.isArray(data)) return data as T[];
    if (data && Array.isArray(data.results)) return data.results as T[];
    return data ? [data as T] : [];
  }

  async getAllPaginated(params?: any): Promise<PaginatedResponse<T>> {
    const response: AxiosResponse<PaginatedResponse<T>> = await apiClient.get(
      this.endpoint,
      params
    );
    return response.data;
  }

  async getById(id: number): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.get(`${this.endpoint}${id}/`);
    return response.data;
  }

  async create(data: Partial<T>): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.post(this.endpoint, data);
    return response.data;
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.put(
      `${this.endpoint}${id}/`,
      data
    );
    return response.data;
  }

  async partialUpdate(id: number, data: Partial<T>): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.patch(
      `${this.endpoint}${id}/`,
      data
    );
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}${id}/`);
  }
}
