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

// Fetch coaches ledger
export const fetchCoachesLedger = createAsyncThunk(
  'coachesLedger/fetchCoachesLedger',
  async ({ dateFrom, dateTo }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const params = {};
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const response = await api.get('/super-admin/coach-ledger', {
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = response.data;
      console.log('Coaches Ledger API Response:', data);

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

// Fetch individual coach ledger
export const fetchCoachLedger = createAsyncThunk(
  'coachesLedger/fetchCoachLedger',
  async ({ coachId, dateFrom, dateTo }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const params = {};
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const response = await api.get(`/super-admin/coach-ledger/${coachId}`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = response.data;
      console.log('Coach Ledger API Response:', data);

      return {
        coachLedger: data.data || [],
        coachInfo: data.coach || {},
        meta: data.meta || {},
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);

const initialState = {
  ledger: [],
  coachLedger: [],
  coachInfo: null,
  loading: false,
  coachLoading: false,
  error: null,
  coachError: null,
  meta: {},
  coachMeta: {},
};

const coachesLedgerSlice = createSlice({
  name: 'coachesLedger',
  initialState,
  reducers: {
    clearLedgerError: (state) => {
      state.error = null;
    },
    clearCoachError: (state) => {
      state.coachError = null;
    },
    clearAllErrors: (state) => {
      state.error = null;
      state.coachError = null;
    },
    clearCoachData: (state) => {
      state.coachLedger = [];
      state.coachInfo = null;
      state.coachMeta = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch coaches ledger
      .addCase(fetchCoachesLedger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoachesLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.ledger = action.payload.ledger;
        state.meta = action.payload.meta;
      })
      .addCase(fetchCoachesLedger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch individual coach ledger
      .addCase(fetchCoachLedger.pending, (state) => {
        state.coachLoading = true;
        state.coachError = null;
      })
      .addCase(fetchCoachLedger.fulfilled, (state, action) => {
        state.coachLoading = false;
        state.coachLedger = action.payload.coachLedger;
        state.coachInfo = action.payload.coachInfo;
        state.coachMeta = action.payload.meta;
      })
      .addCase(fetchCoachLedger.rejected, (state, action) => {
        state.coachLoading = false;
        state.coachError = action.payload;
      });
  },
});

export const {
  clearLedgerError,
  clearCoachError,
  clearAllErrors,
  clearCoachData,
} = coachesLedgerSlice.actions;

export default coachesLedgerSlice.reducer;
