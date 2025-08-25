import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector } from './hooks/useAppSelector';
import { useAppDispatch } from './hooks/useAppDispatch';
import { setTheme } from './store/slices/themeSlice';
import { setLanguage } from './store/slices/languageSlice';
import { useLanguageSync } from './hooks/useLanguageSync';

// Import i18n configuration
import './locales/i18n';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import routes
import AppRoutes from './routes';

// App Content Component
const AppContent = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const language = useAppSelector((state) => state.language.language);
  
  // Sync i18n with Redux state
  useLanguageSync();

  useEffect(() => {
    // Initialize theme and language on app load
    dispatch(setTheme(theme));
    dispatch(setLanguage(language));
  }, [dispatch, theme, language]);

  return (
    <Router>
      <div className="app" data-theme={theme} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <AppRoutes />
      </div>

      <style jsx>{`
        .app {
          min-height: 100vh;
          transition: all 0.3s ease;
        }

        .page-placeholder {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--bs-secondary);
        }

        .page-placeholder h2 {
          margin-bottom: 1rem;
          color: var(--bs-dark);
        }

        /* Dark theme support */
        [data-theme="dark"] .page-placeholder h2 {
          color: #ffffff;
        }

        [data-theme="dark"] .page-placeholder {
          color: #cccccc;
        }

        /* RTL support */
        [dir="rtl"] .page-placeholder {
          text-align: center;
        }
      `}</style>
    </Router>
  );
};

// Main App Component
const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
