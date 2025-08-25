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

// Async thunks for Question Groups
export const fetchQuestionGroups = createAsyncThunk(
  'questionGroups/fetchQuestionGroups',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      const response = await api.get('/super-admin/courses/question-groups', {
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

export const createQuestionGroup = createAsyncThunk(
  'questionGroups/createQuestionGroup',
  async (groupData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      const formData = new FormData();
      formData.append('title_ar', groupData.title_ar);
      formData.append('title_en', groupData.title_en);
      
      const response = await api.post('/super-admin/courses/question-groups', formData, {
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

export const deleteQuestionGroup = createAsyncThunk(
  'questionGroups/deleteQuestionGroup',
  async (groupId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      await api.delete(`/super-admin/courses/question-groups/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return groupId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);

// Async thunks for Questions
export const fetchQuestions = createAsyncThunk(
  'questionGroups/fetchQuestions',
  async (groupId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      const response = await api.get(`/super-admin/courses/${groupId}/questions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return { groupId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);

export const createQuestion = createAsyncThunk(
  'questionGroups/createQuestion',
  async ({ groupId, questionData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const formData = new FormData();
      
      // Add image if provided
      if (questionData.image) {
        formData.append('image', questionData.image);
      }
      
      // Add basic fields
      formData.append('type', questionData.type);
      formData.append('description[ar]', questionData.description_ar);
      formData.append('description[en]', questionData.description_en);
      
      // Add answers array
      if (questionData.answers && questionData.answers.length > 0) {
        questionData.answers.forEach((answer, index) => {
          formData.append(`answers[${index}][description][en]`, answer.description_en);
          formData.append(`answers[${index}][description][ar]`, answer.description_ar);
        });
      }
      
      const response = await api.post(`/super-admin/courses/${groupId}/questions`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return { groupId, data: response.data?.data || response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  'questionGroups/deleteQuestion',
  async ({ groupId, questionId }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      await api.delete(`/super-admin/courses/${groupId}/questions/${questionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return { groupId, questionId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);

const initialState = {
  // Question Groups state
  groups: [],
  groupsLoading: false,
  groupsError: null,
  createGroupLoading: false,
  createGroupError: null,
  deleteGroupLoading: false,
  deleteGroupError: null,
  
  // Questions state
  questions: {},
  questionsLoading: {},
  questionsError: {},
  createQuestionLoading: {},
  createQuestionError: {},
  deleteQuestionLoading: {},
  deleteQuestionError: {},
};

const questionGroupsSlice = createSlice({
  name: 'questionGroups',
  initialState,
  reducers: {
    clearGroupsError: (state) => {
      state.groupsError = null;
    },
    clearCreateGroupError: (state) => {
      state.createGroupError = null;
    },
    clearDeleteGroupError: (state) => {
      state.deleteGroupError = null;
    },
    clearQuestionsError: (state, action) => {
      const groupId = action.payload;
      if (state.questionsError[groupId]) {
        state.questionsError[groupId] = null;
      }
    },
    clearCreateQuestionError: (state, action) => {
      const groupId = action.payload;
      if (state.createQuestionError[groupId]) {
        state.createQuestionError[groupId] = null;
      }
    },
    clearDeleteQuestionError: (state, action) => {
      const groupId = action.payload;
      if (state.deleteQuestionError[groupId]) {
        state.deleteQuestionError[groupId] = null;
      }
    },
    clearAllErrors: (state) => {
      state.groupsError = null;
      state.createGroupError = null;
      state.deleteGroupError = null;
      state.questionsError = {};
      state.createQuestionError = {};
      state.deleteQuestionError = {};
    },
  },
  extraReducers: (builder) => {
    // Question Groups reducers
    builder
      .addCase(fetchQuestionGroups.pending, (state) => {
        state.groupsLoading = true;
        state.groupsError = null;
      })
      .addCase(fetchQuestionGroups.fulfilled, (state, action) => {
        state.groupsLoading = false;
        
        state.groups = action.payload.data ;
      })
      .addCase(fetchQuestionGroups.rejected, (state, action) => {
        state.groupsLoading = false;
        state.groupsError = action.payload;
      })
      .addCase(createQuestionGroup.pending, (state) => {
        state.createGroupLoading = true;
        state.createGroupError = null;
      })
      .addCase(createQuestionGroup.fulfilled, (state, action) => {
        state.createGroupLoading = false;
        state.groups.push(action.payload.data || action.payload);
      })
      .addCase(createQuestionGroup.rejected, (state, action) => {
        state.createGroupLoading = false;
        state.createGroupError = action.payload;
      })
      .addCase(deleteQuestionGroup.pending, (state) => {
        state.deleteGroupLoading = true;
        state.deleteGroupError = null;
      })
      .addCase(deleteQuestionGroup.fulfilled, (state, action) => {
        state.deleteGroupLoading = false;
        state.groups = state.groups.filter(group => group.id !== action.payload);
        // Remove questions for this group
        if (state.questions[action.payload]) {
          delete state.questions[action.payload];
        }
      })
      .addCase(deleteQuestionGroup.rejected, (state, action) => {
        state.deleteGroupLoading = false;
        state.deleteGroupError = action.payload;
      });

    // Questions reducers
    builder
      .addCase(fetchQuestions.pending, (state, action) => {
        const groupId = action.meta.arg;
        state.questionsLoading[groupId] = true;
        state.questionsError[groupId] = null;
      })
             .addCase(fetchQuestions.fulfilled, (state, action) => {
         const { groupId, data } = action.payload;
         state.questionsLoading[groupId] = false;
         state.questions[groupId] = data.data || data || [];
       })
      .addCase(fetchQuestions.rejected, (state, action) => {
        const groupId = action.meta.arg;
        state.questionsLoading[groupId] = false;
        state.questionsError[groupId] = action.payload;
      })
      .addCase(createQuestion.pending, (state, action) => {
        const groupId = action.meta.arg.groupId;
        state.createQuestionLoading[groupId] = true;
        state.createQuestionError[groupId] = null;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        const { groupId, data } = action.payload;
        state.createQuestionLoading[groupId] = false;
        if (!state.questions[groupId]) {
          state.questions[groupId] = [];
        }
        state.questions[groupId].push(data.data || data);
      })
      .addCase(createQuestion.rejected, (state, action) => {
        const groupId = action.meta.arg.groupId;
        state.createQuestionLoading[groupId] = false;
        state.createQuestionError[groupId] = action.payload;
      })
      .addCase(deleteQuestion.pending, (state, action) => {
        const groupId = action.meta.arg.groupId;
        state.deleteQuestionLoading[groupId] = true;
        state.deleteQuestionError[groupId] = null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        const { groupId, questionId } = action.payload;
        state.deleteQuestionLoading[groupId] = false;
        if (state.questions[groupId]) {
          state.questions[groupId] = state.questions[groupId].filter(
            question => question.id !== questionId
          );
        }
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        const groupId = action.meta.arg.groupId;
        state.deleteQuestionLoading[groupId] = false;
        state.deleteQuestionError[groupId] = action.payload;
      });
  },
});

export const {
  clearGroupsError,
  clearCreateGroupError,
  clearDeleteGroupError,
  clearQuestionsError,
  clearCreateQuestionError,
  clearDeleteQuestionError,
  clearAllErrors,
} = questionGroupsSlice.actions;

export default questionGroupsSlice.reducer;
