import api from './api';

export const authService = {
  // Create Django User
  createUser: (userData: {
    email: string;
    username: string;
    password: string;
    re_password: string;
  }) => api.post('/auth/users/', userData),

  // Login
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/jwt/create/', credentials),

  // Refresh token
  refreshToken: (refresh: string) =>
    api.post('/auth/jwt/refresh/', { refresh }),

  // Get current user
  getCurrentUser: () => api.get('/auth/users/me/'),

  // Register farm owner (complete flow)
  registerFarmOwner: async (data: {
    email: string;
    username: string;
    password: string;
    re_password: string;
    farm_name: string;
    farm_location: string;
  }) => {
    try {
      // Step 1: Create user
      const userResponse = await authService.createUser({
        email: data.email,
        username: data.username,
        password: data.password,
        re_password: data.re_password
      });

      if (userResponse.status === 201) {
        // Step 2: Login
        const loginResponse = await authService.login({
          email: data.email,
          password: data.password
        });

        const { access } = loginResponse.data;
        
        // Step 3: Create farm
        const farmResponse = await api.post('/api/farms/', {
          name: data.farm_name,
          location: data.farm_location
        }, {
          headers: { Authorization: `JWT ${access}` }
        });

        return {
          user: userResponse.data,
          farm: farmResponse.data,
          token: access
        };
      }
      throw new Error('User creation failed');
    } catch (error: any) {
      throw new Error(`Registration failed: ${error.response?.data?.message || error.message}`);
    }
  },

  // Register labourer (complete flow)
  registerLabourer: async (data: {
    email: string;
    username: string;
    password: string;
    re_password: string;
  }) => {
    try {
      // Step 1: Create user
      const userResponse = await authService.createUser({
        email: data.email,
        username: data.username,
        password: data.password,
        re_password: data.re_password
      });

      if (userResponse.status === 201) {
        // Step 2: Login
        const loginResponse = await authService.login({
          email: data.email,
          password: data.password
        });

        const { access } = loginResponse.data;

        // Step 3: Create labourer profile
        const labourerResponse = await api.post('/api/labourers/', {}, {
          headers: { Authorization: `JWT ${access}` }
        });

        return {
          user: userResponse.data,
          labourer: labourerResponse.data,
          token: access
        };
      }
      throw new Error('User creation failed');
    } catch (error: any) {
      throw new Error(`Registration failed: ${error.response?.data?.message || error.message}`);
    }
  }
};