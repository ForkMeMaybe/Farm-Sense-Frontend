import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService, { User, LoginCredentials } from '../../services/authService';
import TokenStorage from '../../utils/tokenStorage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: TokenStorage.getUser(),
  token: TokenStorage.getAccessToken(),
  isAuthenticated: TokenStorage.isAuthenticated(),
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    return response;
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
    return response;
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async () => {
    const user = await authService.getCurrentUser();
    return user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      TokenStorage.clearTokens();
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
        state.user = action.payload.user;
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