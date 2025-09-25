import apiClient from './api';
import TokenStorage from '../utils/tokenStorage';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  re_password: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  owned_farm?: number;
  labourer_profile?: number;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<{
    access: string;
    refresh: string;
    user: User;
  }> {
    try {
      const response = await apiClient.post('/auth/jwt/create/', credentials);
      const { access, refresh } = response.data;
      
      // Store tokens
      TokenStorage.setTokens(access, refresh);
      
      // Fetch user data
      const userResponse = await apiClient.get('/auth/users/me/');
      const user = userResponse.data;
      TokenStorage.setUser(user);
      
      return { access, refresh, user };
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      const response = await apiClient.post('/auth/users/', data);
      return response.data;
    } catch (error: any) {
      const errors = error.response?.data;
      if (errors) {
        const errorMessages = Object.values(errors).flat().join(', ');
        throw new Error(errorMessages);
      }
      throw new Error('Registration failed');
    }
  }

  async refreshTokens(): Promise<string> {
    const refreshToken = TokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiClient.post('/auth/jwt/refresh/', {
        refresh: refreshToken,
      });
      
      const { access } = response.data;
      TokenStorage.setTokens(access, refreshToken);
      return access;
    } catch (error) {
      TokenStorage.clearTokens();
      throw new Error('Token refresh failed');
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/users/me/');
    const user = response.data;
    TokenStorage.setUser(user);
    return user;
  }

  async registerFarmOwner(data: {
    email: string;
    username: string;
    password: string;
    re_password: string;
    farm_name: string;
    farm_location: string;
  }): Promise<{
    user: User;
    farm: any;
    token: string;
  }> {
    try {
      // Step 1: Create user
      const userResponse = await this.register({
        email: data.email,
        username: data.username,
        password: data.password,
        re_password: data.re_password
      });

      // Step 2: Login
      const loginResponse = await this.login({
        email: data.email,
        password: data.password
      });

      const { access, user } = loginResponse;
      
      // Step 3: Create farm
      const farmResponse = await apiClient.post('/api/farms/', {
        name: data.farm_name,
        location: data.farm_location
      });

      return {
        user,
        farm: farmResponse.data,
        token: access
      };
    } catch (error: any) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async registerLabourer(data: RegisterData): Promise<{
    user: User;
    labourer: any;
    token: string;
  }> {
    try {
      // Step 1: Create user
      const userResponse = await this.register(data);

      // Step 2: Login
      const loginResponse = await this.login({
        email: data.email,
        password: data.password
      });

      const { access, user } = loginResponse;

      // Step 3: Create labourer profile
      const labourerResponse = await apiClient.post('/api/labourers/', {});

      return {
        user,
        labourer: labourerResponse.data,
        token: access
      };
    } catch (error: any) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  logout(): void {
    TokenStorage.clearTokens();
    window.location.href = '/login';
  }

  isAuthenticated(): boolean {
    return TokenStorage.isAuthenticated();
  }

  getCurrentUserData(): User | null {
    return TokenStorage.getUser();
  }
}

export default new AuthService();