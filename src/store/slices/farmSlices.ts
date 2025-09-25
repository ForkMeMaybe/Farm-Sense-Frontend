import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { amuService, feedService, yieldService, AMURecord, FeedRecord, YieldRecord } from '../../services/farmService';

// AMU Slice
export interface AMUState {
    records: AMURecord[];
    loading: boolean;
    error: string | null;
    insights: any[];
}

const initialAMUState: AMUState = {
    records: [],
    loading: false,
    error: null,
    insights: [],
};

export const fetchAMURecords = createAsyncThunk(
    'amu/fetchAll',
    async () => {
        const data = await amuService.getAll();
        return Array.isArray(data) ? data : [];
    }
);

export const addAMURecord = createAsyncThunk(
    'amu/add',
    async (data: Omit<AMURecord, 'id'>) => {
        const response = await amuService.create(data);
        return response;
    }
);

export const generateAMUInsights = createAsyncThunk(
    'amu/generateInsights',
    async (livestockId: number) => {
        const response = await amuService.generateInsights(livestockId);
        return response;
    }
);

const amuSlice = createSlice({
    name: 'amu',
    initialState: initialAMUState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAMURecords.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAMURecords.fulfilled, (state, action) => {
                state.loading = false;
                state.records = action.payload;
                state.error = null;
            })
            .addCase(fetchAMURecords.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch AMU records';
            })
            .addCase(addAMURecord.fulfilled, (state, action) => {
                state.records.push(action.payload);
            })
            .addCase(generateAMUInsights.fulfilled, (state, action) => {
                state.insights = action.payload.insights || [];
            });
    },
});

// Feed Slice
export interface FeedState {
    records: FeedRecord[];
    loading: boolean;
    error: string | null;
}

const initialFeedState: FeedState = {
    records: [],
    loading: false,
    error: null,
};

export const fetchFeedRecords = createAsyncThunk(
    'feed/fetchAll',
    async () => {
        const data = await feedService.getAll();
        return Array.isArray(data) ? data : [];
    }
);

export const addFeedRecord = createAsyncThunk(
    'feed/add',
    async (data: Omit<FeedRecord, 'id'>) => {
        const response = await feedService.create(data);
        return response;
    }
);

const feedSlice = createSlice({
    name: 'feed',
    initialState: initialFeedState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeedRecords.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFeedRecords.fulfilled, (state, action) => {
                state.loading = false;
                state.records = action.payload;
                state.error = null;
            })
            .addCase(fetchFeedRecords.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch feed records';
            })
            .addCase(addFeedRecord.fulfilled, (state, action) => {
                state.records.push(action.payload);
            });
    },
});

// Yield Slice
export interface YieldState {
    records: YieldRecord[];
    loading: boolean;
    error: string | null;
}

const initialYieldState: YieldState = {
    records: [],
    loading: false,
    error: null,
};

export const fetchYieldRecords = createAsyncThunk(
    'yield/fetchAll',
    async () => {
        const data = await yieldService.getAll();
        return Array.isArray(data) ? data : [];
    }
);

export const addYieldRecord = createAsyncThunk(
    'yield/add',
    async (data: Omit<YieldRecord, 'id'>) => {
        const response = await yieldService.create(data);
        return response;
    }
);

const yieldSlice = createSlice({
    name: 'yield',
    initialState: initialYieldState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchYieldRecords.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchYieldRecords.fulfilled, (state, action) => {
                state.loading = false;
                state.records = action.payload;
                state.error = null;
            })
            .addCase(fetchYieldRecords.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch yield records';
            })
            .addCase(addYieldRecord.fulfilled, (state, action) => {
                state.records.push(action.payload);
            });
    },
});

export const amuReducer = amuSlice.reducer;
export const feedReducer = feedSlice.reducer;
export const yieldReducer = yieldSlice.reducer;