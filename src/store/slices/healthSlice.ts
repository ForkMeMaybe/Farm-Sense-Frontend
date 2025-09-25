import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { healthService } from '../../services/healthService';

export interface HealthRecord {
  id: number;
  livestock: number;
  event_type: 'vaccination' | 'sickness' | 'check-up' | 'treatment';
  event_date: string;
  notes?: string;
  diagnosis?: string;
  treatment_outcome?: string;
}

interface HealthState {
  records: HealthRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: HealthState = {
  records: [],
  loading: false,
  error: null,
};

export const fetchHealthRecords = createAsyncThunk(
  'health/fetchAll',
  async () => {
    const response = await healthService.getAll();
    return response.data;
  }
);

export const addHealthRecord = createAsyncThunk(
  'health/add',
  async (data: Omit<HealthRecord, 'id'>) => {
    const response = await healthService.create(data);
    return response.data;
  }
);

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealthRecords.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHealthRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
        state.error = null;
      })
      .addCase(fetchHealthRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch health records';
      })
      .addCase(addHealthRecord.fulfilled, (state, action) => {
        state.records.push(action.payload);
      });
  },
});

export default healthSlice.reducer;