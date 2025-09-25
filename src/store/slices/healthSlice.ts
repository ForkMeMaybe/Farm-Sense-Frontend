import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import healthRecordService, { HealthRecord } from '../../services/healthService';

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
    const data = await healthRecordService.getAll();
    return Array.isArray(data) ? data : [];
  }
);

export const addHealthRecord = createAsyncThunk(
  'health/add',
  async (data: Omit<HealthRecord, 'id'>) => {
    const response = await healthRecordService.create(data);
    return response;
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