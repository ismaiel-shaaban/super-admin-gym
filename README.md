# Admin Dashboard

A modern, responsive admin dashboard built with React, Vite, Redux Toolkit, and React Bootstrap. Features dark/light theme support, internationalization (Arabic/English), and a comprehensive user management system.

## 🚀 Features

- **Modern React Setup**: Built with Vite for fast development and optimized builds
- **Redux Toolkit**: Centralized state management with RTK Query for API handling
- **React Bootstrap**: Beautiful, responsive UI components
- **Dark/Light Theme**: Toggle between dark and light themes with system preference detection
- **Internationalization**: Full Arabic and English support with RTL layout
- **Protected Routes**: Authentication-based route protection
- **User Management**: Complete CRUD operations for user management
- **Responsive Design**: Mobile-first responsive design
- **Modern UI/UX**: Clean, professional interface with smooth animations

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Top navigation bar
│   └── Sidebar.jsx     # Side navigation menu
├── layouts/            # Layout components
│   └── DashboardLayout.jsx
├── pages/              # Page components
│   ├── Login.jsx       # Authentication page
│   ├── Dashboard.jsx   # Main dashboard
│   └── Users.jsx       # User management
├── store/              # Redux store configuration
│   ├── index.js        # Store setup
│   └── slices/         # Redux slices
│       ├── authSlice.js
│       ├── themeSlice.js
│       └── languageSlice.js
├── locales/            # Internationalization
│   ├── i18n.js         # i18n configuration
│   ├── en.json         # English translations
│   └── ar.json         # Arabic translations
├── routes/             # Routing configuration
│   └── index.jsx       # Main routes
├── utils/              # Utility functions and constants
│   └── constants.js    # Global constants
└── hooks/              # Custom React hooks
    ├── useAppDispatch.js
    └── useAppSelector.js
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **UI Library**: React Bootstrap
- **Routing**: React Router DOM
- **Internationalization**: React i18next
- **Styling**: CSS-in-JS with styled-jsx
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd admin-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## 🌐 Routes

### Public Routes
- `/admin-dashboard/login` - Login page

### Protected Routes (all under `/dashboard`)
- `/dashboard` - Main dashboard (statistics)
- `/dashboard/statistics` - Statistics overview
- `/dashboard/users` - User management
- `/dashboard/reports` - Reports (under construction)
- `/dashboard/analytics` - Analytics (under construction)
- `/dashboard/settings` - Settings (under construction)
- `/dashboard/profile` - User profile (under construction)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Admin Dashboard
VITE_APP_VERSION=1.0.0
```

### Global Constants

All global constants are defined in `src/utils/constants.js`:

- **APP_CONFIG**: Application configuration
- **ROUTES**: Route definitions
- **API_ENDPOINTS**: API endpoint URLs
- **STORAGE_KEYS**: Local storage keys
- **THEMES**: Theme options
- **LANGUAGES**: Language options

## 🎨 Theming

The application supports both light and dark themes:

- **Automatic Detection**: Detects system preference on first load
- **Manual Toggle**: Users can toggle themes via the sidebar
- **Persistent**: Theme preference is saved in localStorage

## 🌍 Internationalization

Full support for Arabic and English:

- **Automatic Detection**: Detects browser language
- **Manual Toggle**: Users can switch languages via the sidebar
- **RTL Support**: Automatic right-to-left layout for Arabic
- **Persistent**: Language preference is saved in localStorage

## 🔐 Authentication

The application includes a complete authentication system:

- **Login/Logout**: Full authentication flow
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Token Management**: JWT token storage and management
- **Mock Authentication**: Demo mode for development

## 📱 Responsive Design

The dashboard is fully responsive:

- **Desktop**: Full sidebar and navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Mobile-optimized layout

## 🧪 Development

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route to `src/routes/index.jsx`
3. Add navigation item to `src/components/Sidebar.jsx`
4. Add translations to `src/locales/en.json` and `src/locales/ar.json`

### Adding New Redux Slices

1. Create a new slice in `src/store/slices/`
2. Add the reducer to `src/store/index.js`
3. Export actions and selectors

### Adding New API Endpoints

1. Add endpoint to `src/utils/constants.js` (API_ENDPOINTS)
2. Create Redux thunk in the appropriate slice
3. Handle loading, success, and error states

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@example.com or create an issue in the repository.

## 🔄 Updates

### Version 1.0.0
- Initial release
- Complete authentication system
- User management
- Theme and language support
- Responsive design

---

**Built with ❤️ using React and modern web technologies**
