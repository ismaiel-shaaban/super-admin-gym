import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS, STORAGE_KEYS, APP_CONFIG } from '../../utils/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch trainees ledger
export const fetchTraineesLedger = createAsyncThunk(
  'traineesLedger/fetchTraineesLedger',
  async ({ dateFrom, dateTo }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const params = {};
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const response = await api.get('/super-admin/trainee-ledger', {
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = response.data;
      console.log('Trainees Ledger API Response:', data);

      return {
        ledger: data.data || [],
        meta: data.meta || {},
        links: data.links || {},
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);

// Fetch individual trainee ledger
export const fetchTraineeLedger = createAsyncThunk(
  'traineesLedger/fetchTraineeLedger',
  async ({ traineeId, dateFrom, dateTo }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const params = {};
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const response = await api.get(`/super-admin/trainee-ledger/${traineeId}`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = response.data;
      console.log('Trainee Ledger API Response:', data);

      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);

const initialState = {
  ledger: [],
  traineeLedger: [],
  traineeInfo: null,
  loading: false,
  traineeLoading: false,
  error: null,
  traineeError: null,
  meta: {},
  traineeMeta: {},
};

const traineesLedgerSlice = createSlice({
  name: 'traineesLedger',
  initialState,
  reducers: {
    clearLedgerError: (state) => {
      state.error = null;
    },
    clearTraineeError: (state) => {
      state.traineeError = null;
    },
    clearAllErrors: (state) => {
      state.error = null;
      state.traineeError = null;
    },
    clearTraineeData: (state) => {
      state.traineeLedger = [];
      state.traineeInfo = null;
      state.traineeMeta = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch trainees ledger
      .addCase(fetchTraineesLedger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTraineesLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.ledger = action.payload.ledger;
        state.meta = action.payload.meta;
      })
      .addCase(fetchTraineesLedger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch individual trainee ledger
      .addCase(fetchTraineeLedger.pending, (state) => {
        state.traineeLoading = true;
        state.traineeError = null;
      })
      .addCase(fetchTraineeLedger.fulfilled, (state, action) => {
        state.traineeLoading = false;
        state.traineeLedger = action.payload.data;
        
        // Extract trainee info from the nested structure
        const traineeData = action.payload?.data;
        if (traineeData) {
          // Combine trainee info with the rest of the data
          state.traineeInfo = {
            ...traineeData.trainee,
            subscriptions: traineeData.subscriptions,
            spending: traineeData.spending,
            coaches: traineeData.coaches
          };
        }
        state.traineeMeta = action.payload.meta;
      })
      .addCase(fetchTraineeLedger.rejected, (state, action) => {
        state.traineeLoading = false;
        state.traineeError = action.payload;
      });
  },
});

export const {
  clearLedgerError,
  clearTraineeError,
  clearAllErrors,
  clearTraineeData,
} = traineesLedgerSlice.actions;

export default traineesLedgerSlice.reducer;
