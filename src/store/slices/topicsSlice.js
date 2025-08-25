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

// Async thunk for fetching topics
export const fetchTopics = createAsyncThunk(
  'topics/fetchTopics',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      const response = await api.get('/super-admin/courses/topics', {
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

// Async thunk for creating a topic
export const createTopic = createAsyncThunk(
  'topics/createTopic',
  async (topicData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      const response = await api.post('/super-admin/courses/topics', topicData, {
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

// Async thunk for deleting a topic
export const deleteTopic = createAsyncThunk(
  'topics/deleteTopic',
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      await api.delete(`/super-admin/courses/topics/${id}`, {
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
  topics: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  deleteLoading: false,
  deleteError: null,
};

const topicsSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    clearTopicsError: (state) => {
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
      // Fetch Topics
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Topic
      .addCase(createTopic.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createTopic.fulfilled, (state, action) => {
        state.createLoading = false;
        state.topics.push(action.payload);
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })
      // Delete Topic
      .addCase(deleteTopic.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.topics = state.topics.filter(topic => topic.id !== action.payload);
      })
      .addCase(deleteTopic.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

export const { 
  clearTopicsError, 
  clearCreateError, 
  clearDeleteError, 
  clearAllErrors 
} = topicsSlice.actions;

export default topicsSlice.reducer;
