import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { APP_CONFIG } from '../../utils/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Async thunk for fetching dashboard statistics
export const fetchDashboardStatistics = createAsyncThunk(
  'dashboard/fetchStatistics',
  async (dateParams = {}, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      // Build query parameters
      const params = new URLSearchParams();
      if (dateParams.date_from) {
        params.append('date_from', dateParams.date_from);
      }
      if (dateParams.date_to) {
        params.append('date_to', dateParams.date_to);
      }
      
      const url = `/super-admin/dashboard/statistics${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await api.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);

const initialState = {
  statistics: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data;
      })
      .addCase(fetchDashboardStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;

export default dashboardSlice.reducer;
