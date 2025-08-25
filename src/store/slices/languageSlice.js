import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, LANGUAGES, APP_CONFIG } from '../../utils/constants';

const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
  if (savedLanguage && (savedLanguage === LANGUAGES.ENGLISH || savedLanguage === LANGUAGES.ARABIC)) {
    return savedLanguage;
  }
  // Check browser language
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.startsWith('ar')) {
    return LANGUAGES.ARABIC;
  }
  return APP_CONFIG.DEFAULT_LANGUAGE;
};

const initialState = {
  language: getInitialLanguage(),
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      const newLanguage = action.payload;
      state.language = newLanguage;
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLanguage);
      // Update document direction for RTL support
      document.documentElement.dir = newLanguage === LANGUAGES.ARABIC ? 'rtl' : 'ltr';
      document.documentElement.lang = newLanguage;
    },
    toggleLanguage: (state) => {
      const newLanguage = state.language === LANGUAGES.ENGLISH ? LANGUAGES.ARABIC : LANGUAGES.ENGLISH;
      state.language = newLanguage;
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLanguage);
      document.documentElement.dir = newLanguage === LANGUAGES.ARABIC ? 'rtl' : 'ltr';
      document.documentElement.lang = newLanguage;
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer; 