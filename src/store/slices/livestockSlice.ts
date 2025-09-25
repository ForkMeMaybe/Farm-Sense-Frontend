import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import livestockService, { Livestock } from '../../services/livestockService';

interface LivestockState {
  animals: Livestock[];
  selectedAnimal: Livestock | null;
  loading: boolean;
  error: string | null;
}

const initialState: LivestockState = {
  animals: [],
  selectedAnimal: null,
  loading: false,
  error: null,
};

export const fetchLivestock = createAsyncThunk(
  'livestock/fetchAll',
  async () => {
    const data = await livestockService.getAll();
    return Array.isArray(data) ? data : [];
  }
);

export const addLivestock = createAsyncThunk(
  'livestock/add',
  async (data: Omit<Livestock, 'id'>) => {
    const response = await livestockService.create(data);
    return response;
  }
);

export const updateLivestock = createAsyncThunk(
  'livestock/update',
  async ({ id, data }: { id: number; data: Partial<Livestock> }) => {
    const response = await livestockService.update(id, data);
    return response;
  }
);

export const deleteLivestock = createAsyncThunk(
  'livestock/delete',
  async (id: number) => {
    await livestockService.delete(id);
    return id;
  }
);

const livestockSlice = createSlice({
  name: 'livestock',
  initialState,
  reducers: {
    selectAnimal: (state, action) => {
      state.selectedAnimal = action.payload;
    },
    clearSelectedAnimal: (state) => {
      state.selectedAnimal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLivestock.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLivestock.fulfilled, (state, action) => {
        state.loading = false;
        state.animals = action.payload;
        state.error = null;
      })
      .addCase(fetchLivestock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch livestock';
      })
      .addCase(addLivestock.fulfilled, (state, action) => {
        state.animals.push(action.payload);
      })
      .addCase(updateLivestock.fulfilled, (state, action) => {
        const index = state.animals.findIndex(animal => animal.id === action.payload.id);
        if (index !== -1) {
          state.animals[index] = action.payload;
        }
      })
      .addCase(deleteLivestock.fulfilled, (state, action) => {
        state.animals = state.animals.filter(animal => animal.id !== action.payload);
      });
  },
});

export const { selectAnimal, clearSelectedAnimal } = livestockSlice.actions;
export default livestockSlice.reducer;