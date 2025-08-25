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

// Async thunk for fetching settings
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      const response = await api.get('/super-admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = response.data?.data || response.data;
      
      // Handle array response - find the app_images setting or use the first item
      let settingsData = null;
      if (Array.isArray(data)) {
        // Try to find the app_images setting
        settingsData = data.find(item => item.key === 'app_images') || data[0];
      } else {
        settingsData = data;
      }

      return settingsData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);

// Async thunk for updating settings
export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settingsData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const currentSettings = getState().settings.settings;
      
      // Get the ID from current settings
      const settingsId = currentSettings?.id;
      
      if (!settingsId) {
        throw new Error('Settings ID not found. Please refresh the page and try again.');
      }
      
      const formData = new FormData();
      
      // Add text fields
      // if (settingsData.key) formData.append('key', settingsData.key);
      if (settingsData.value) formData.append('value', settingsData.value);
      
      // Add image files
      if (settingsData.home_screen) {
        formData.append('home_screen', settingsData.home_screen);
      }
      if (settingsData.splash_screen) {
        if (Array.isArray(settingsData.splash_screen)) {
          settingsData.splash_screen.forEach((file, index) => {
            formData.append(`splash_screen[]`, file);
          });
        } else {
          formData.append('splash_screen', settingsData.splash_screen);
        }
      }
      if (settingsData.exercise_screen) {
        formData.append('exercise_screen', settingsData.exercise_screen);
      }
      
      // Add images to delete array
      if (settingsData.images_to_delete && Array.isArray(settingsData.images_to_delete)) {
        settingsData.images_to_delete.forEach((id, index) => {
          formData.append(`images_to_delete[${index}]`, id);
        });
      }
      
      const response = await api.post(`/super-admin/settings/${settingsId}?_method=put`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);

const initialState = {
  settings: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearSettingsError: (state) => {
      state.error = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearAllErrors: (state) => {
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Settings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Settings
      .addCase(updateSettings.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Update the settings with the response data
        if (action.payload) {
          state.settings = { ...state.settings, ...action.payload };
        }
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  },
});

export const { 
  clearSettingsError, 
  clearUpdateError, 
  clearAllErrors 
} = settingsSlice.actions;

export default settingsSlice.reducer;
