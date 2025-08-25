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

// Async thunk for fetching slides
export const fetchSlides = createAsyncThunk(
  'slider/fetchSlides',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      const response = await api.get('/super-admin/home/slides', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);

// Async thunk for creating a slide
export const createSlide = createAsyncThunk(
  'slider/createSlide',
  async (slideData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      const formData = new FormData();
      formData.append('title', slideData.title);
      formData.append('image', slideData.image);
      
      const response = await api.post('/super-admin/home/slides', formData, {
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

// Async thunk for deleting a slide
export const deleteSlide = createAsyncThunk(
  'slider/deleteSlide',
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      await api.delete(`/super-admin/home/slides/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);

const initialState = {
  slides: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  deleteLoading: false,
  deleteError: null,
};

const sliderSlice = createSlice({
  name: 'slider',
  initialState,
  reducers: {
    clearSliderError: (state) => {
      state.error = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearAllErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Slides
      .addCase(fetchSlides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSlides.fulfilled, (state, action) => {
        state.loading = false;
        state.slides = action.payload;
      })
      .addCase(fetchSlides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Slide
      .addCase(createSlide.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createSlide.fulfilled, (state, action) => {
        state.createLoading = false;
        state.slides.push(action.payload);
      })
      .addCase(createSlide.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })
      // Delete Slide
      .addCase(deleteSlide.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteSlide.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.slides = state.slides.filter(slide => slide.id !== action.payload);
      })
      .addCase(deleteSlide.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

export const { 
  clearSliderError, 
  clearCreateError, 
  clearDeleteError, 
  clearAllErrors 
} = sliderSlice.actions;

export default sliderSlice.reducer;
