import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import TokenStorage from '../utils/tokenStorage';

class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    // Use relative URLs when in development (proxy will handle the routing)
    const baseURL = import.meta.env.DEV 
      ? '' // Use relative URLs in development to leverage Vite proxy
      : import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    
    this.instance = axios.create({
      baseURL,
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
      headers: {
        'Content-Type': 'application/json',
        // Only add ngrok header in production (proxy handles it in dev)
        ...(import.meta.env.PROD && { 'ngrok-skip-browser-warning': 'true' }),
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = TokenStorage.getAccessToken();
        if (token) {
          config.headers.Authorization = `JWT ${token}`;
        }

        // In development, the proxy handles ngrok headers
        // In production, add ngrok header if needed
        if (import.meta.env.PROD) {
          try {
            const urlHost = new URL(config.baseURL || '').host;
            if (urlHost.includes('ngrok')) {
              (config.headers as any)['ngrok-skip-browser-warning'] = 'true';
            }
          } catch {}
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for token refresh
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers.Authorization = `JWT ${token}`;
              return this.instance(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = TokenStorage.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            const refreshURL = import.meta.env.DEV 
              ? '/auth/jwt/refresh/' // Use relative URL in development (proxy handles it)
              : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/auth/jwt/refresh/`;
            
            const response = await axios.post(
              refreshURL,
              { refresh: refreshToken },
              {
                headers: {
                  ...(import.meta.env.PROD && { 'ngrok-skip-browser-warning': 'true' }),
                }
              }
            );

            const { access } = response.data;
            TokenStorage.setTokens(access, refreshToken);

            // Process failed queue
            this.failedQueue.forEach(({ resolve }) => resolve(access));
            this.failedQueue = [];

            originalRequest.headers.Authorization = `JWT ${access}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            this.failedQueue.forEach(({ reject }) => reject(refreshError));
            this.failedQueue = [];
            TokenStorage.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // HTTP Methods
  get<T = any>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.instance.get(url, { params });
  }

  post<T = any>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data);
  }

  put<T = any>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.instance.put(url, data);
  }

  patch<T = any>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.instance.patch(url, data);
  }

  delete<T = any>(url: string): Promise<AxiosResponse<T>> {
    return this.instance.delete(url);
  }
}

export default new ApiClient();