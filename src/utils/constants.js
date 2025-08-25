// Global constants for the application

// Theme configuration
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Language configuration
export const LANGUAGES = {
  ENGLISH: 'en',
  ARABIC: 'ar',
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'Admin Dashboard',
  API_BASE_URL: import.meta.env.VITE_API_URL || 'https://stg-api.fitcircle.coach/api/v1',
  DEFAULT_THEME: THEMES.LIGHT,
  DEFAULT_LANGUAGE: LANGUAGES.ENGLISH,
  VERSION: '1.0.0',
};

  // Route constants
export const ROUTES = {
  // Public routes
  LOGIN: '/admin-dashboard/login',
  
  // Protected routes (all under dashboard)
  DASHBOARD: {
    ROOT: '/dashboard',
    STATISTICS: '/dashboard/statistics',
    USERS: '/dashboard/users',
    COACHES: '/dashboard/coaches',
    TRAINEES: '/dashboard/trainees',
    REPORTS: '/dashboard/reports',
    ANALYTICS: '/dashboard/analytics',
    SETTINGS: '/dashboard/settings',
    SLIDER: '/dashboard/slider',
    TOPICS: '/dashboard/topics',
    COACHES_LEDGER: '/dashboard/coaches-ledger',
    TRAINEES_LEDGER: '/dashboard/trainees-ledger',
    QUESTION_GROUPS: '/dashboard/question-groups',
    PROFILE: '/dashboard/profile',
  },
  
  // Redirect routes
  HOME: '/',
  NOT_FOUND: '/404',
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    DETAILS: (id) => `/users/${id}`,
  },
  DASHBOARD: {
    STATISTICS: '/dashboard/statistics',
    ACTIVITY: '/dashboard/activity',
  },
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'admin_dashboard_token',
  USER: 'admin_dashboard_user',
  THEME: 'admin_dashboard_theme',
  LANGUAGE: 'admin_dashboard_language',
  SIDEBAR_COLLAPSED: 'admin_dashboard_sidebar_collapsed',
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  COACH: 'coach',
  TRAINEE: 'trainee',
  SUPER_ADMIN: 'super_admin',
};

// User role IDs (for API filtering)
export const USER_ROLE_IDS = {
  SUPER_ADMIN: 1,
  COACH: "coach",
  TRAINEE: "trainee",
};

// User status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Table actions
export const TABLE_ACTIONS = {
  VIEW: 'view',
  EDIT: 'edit',
  DELETE: 'delete',
  EXPORT: 'export',
};

// Export formats
export const EXPORT_FORMATS = {
  CSV: 'csv',
  EXCEL: 'xlsx',
  PDF: 'pdf',
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
};

// Validation rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  USER_CREATED: 'User created successfully!',
  USER_UPDATED: 'User updated successfully!',
  USER_DELETED: 'User deleted successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
}; 