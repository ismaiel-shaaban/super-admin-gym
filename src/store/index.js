import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import languageReducer from './slices/languageSlice';
import usersReducer from './slices/usersSlice';
import countriesReducer from './slices/countriesSlice';
import settingsReducer from './slices/settingsSlice';
import sliderReducer from './slices/sliderSlice';
import topicsReducer from './slices/topicsSlice';
import coachesLedgerReducer from './slices/coachesLedgerSlice';
import traineesLedgerReducer from './slices/traineesLedgerSlice';
import questionGroupsReducer from './slices/questionGroupsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    language: languageReducer,
    users: usersReducer,
    countries: countriesReducer,
    settings: settingsReducer,
    slider: sliderReducer,
    topics: topicsReducer,
    coachesLedger: coachesLedgerReducer,
    traineesLedger: traineesLedgerReducer,
    questionGroups: questionGroupsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 