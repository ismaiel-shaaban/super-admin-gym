import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from './useAppSelector';
import { LANGUAGES } from '../utils/constants';

export const useLanguageSync = () => {
  const { i18n } = useTranslation();
  const language = useAppSelector((state) => state.language.language);

  useEffect(() => {
    // Sync i18n language with Redux state
    if (i18n.language !== language && (language === LANGUAGES.ENGLISH || language === LANGUAGES.ARABIC)) {
      console.log('Changing i18n language from', i18n.language, 'to', language);
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  // Initialize i18n with the current Redux language on mount
  useEffect(() => {
    if (language && i18n.language !== language) {
      console.log('Initializing i18n with language:', language);
      i18n.changeLanguage(language);
    }
  }, []); // Only run on mount

  return { i18n, language };
}; 