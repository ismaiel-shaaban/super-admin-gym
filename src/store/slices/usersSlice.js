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

// Async thunk for fetching users with pagination, role filtering, and search
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page = 1, role = null, search = null }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      const params = { page };
      if (role) params.role = role;
      if (search) params.search = search;
      
      const response = await api.get('/super-admin/users', {
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = response.data;
      console.log('Users API Response:', data);

      return {
        users: data.data || [],
        meta: data.meta || {},
        links: data.links || {},
        role: role
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);

// Async thunk for creating a user
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      const response = await api.post('/super-admin/users', userData, {
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

// Async thunk for updating a user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      const response = await api.put(`/super-admin/users/${id}`, userData, {
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

// Async thunk for deleting a user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      await api.delete(`/super-admin/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return id; // Return the deleted user ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
  // Pagination state
  currentPage: 1,
  lastPage: 1,
  perPage: 10,
  total: 0,
  from: 0,
  to: 0,
  links: {},
  meta: {},
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearAllErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.meta = action.payload.meta;
        state.links = action.payload.links;
        // Update pagination state
        state.currentPage = action.payload.meta.current_page || 1;
        state.lastPage = action.payload.meta.last_page || 1;
        state.perPage = action.payload.meta.per_page || 10;
        state.total = action.payload.meta.total || 0;
        state.from = action.payload.meta.from || 0;
        state.to = action.payload.meta.to || 0;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.createLoading = false;
        state.users.push(action.payload);
        state.total += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

export const { 
  clearUsersError, 
  clearCreateError, 
  clearUpdateError, 
  clearDeleteError, 
  clearAllErrors,
  setCurrentPage
} = usersSlice.actions;

export default usersSlice.reducer;
