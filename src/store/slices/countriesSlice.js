import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { APP_CONFIG } from '../../utils/constants';

// Async thunk for fetching countries
export const fetchCountries = createAsyncThunk(
  'countries/fetchCountries',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      const response = await fetch(`https://dev-api.fitcircle.coach/api/countries`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch countries');
      }

      return data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const countriesSlice = createSlice({
  name: 'countries',
  initialState: {
    countries: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCountriesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload.data;
        console.log(state.countries);
        state.error = null;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCountriesError } = countriesSlice.actions;
export default countriesSlice.reducer;
