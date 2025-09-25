import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

interface User {
  id: number;
  email: string;
  username: string;
  owned_farm?: number;
  labourer_profile?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await authService.login(credentials);
    localStorage.setItem('token', response.data.access);
    return response.data;
  }
);

export const registerFarmOwner = createAsyncThunk(
  'auth/registerFarmOwner',
  async (data: {
    email: string;
    username: string;
    password: string;
    re_password: string;
    farm_name: string;
    farm_location: string;
  }) => {
    const response = await authService.registerFarmOwner(data);
    localStorage.setItem('token', response.token);
    return response;
  }
);

export const registerLabourer = createAsyncThunk(
  'auth/registerLabourer',
  async (data: {
    email: string;
    username: string;
    password: string;
    re_password: string;
  }) => {
    const response = await authService.registerLabourer(data);
    localStorage.setItem('token', response.token);
    return response;
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async () => {
    const response = await authService.getCurrentUser();
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register Farm Owner
      .addCase(registerFarmOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerFarmOwner.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerFarmOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Register Labourer
      .addCase(registerLabourer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerLabourer.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerLabourer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Get Current User
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;