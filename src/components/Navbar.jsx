import React, { useState } from 'react';
import { Navbar, Container, Form, Button, Dropdown, Badge, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { logout } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import { toggleLanguage } from '../store/slices/languageSlice';
import { APP_CONFIG, THEMES, LANGUAGES, ROUTES } from '../utils/constants';
import { 
  FiSearch, 
  FiBell, 
  FiUser, 
  FiSettings, 
  FiLogOut,
  FiChevronDown,
  FiMenu,
  FiMoon,
  FiSun
} from 'react-icons/fi';

const TopNavbar = ({ onMobileToggle }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const language = useAppSelector((state) => state.language.language);
  const user = useAppSelector((state) => state.auth.user);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    // Clear authentication data
    dispatch(logout());
    // Navigate to login page
    navigate(ROUTES.LOGIN);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search logic here
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLanguageToggle = () => {
    dispatch(toggleLanguage());
  };

  return (
    <Navbar 
      bg={theme === THEMES.DARK ? 'dark' : 'light'} 
      variant={theme === THEMES.DARK ? 'dark' : 'light'}
      expand="lg" 
      className="top-navbar"
      fixed="top"
    >
      <Container fluid>
        <Button
          variant="outline-secondary"
          className="mobile-menu-btn d-md-none"
          onClick={onMobileToggle}
        >
          <FiMenu />
        </Button>

        <Navbar.Brand href="#home" className="navbar-brand">
          <div className="brand-content">
            <div className="brand-icon">
              <img src="/images/logo-admin-layout.svg" alt="Logo" className="brand-logo " />
            </div>
          
          </div>
        </Navbar.Brand>

      

        <div className="navbar-right">
          {/* Theme Toggle */}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleThemeToggle}
            className="control-btn"
            title={t(`common.${theme}`)}
            aria-label={t(`common.${theme}`)}
          >
            {theme === THEMES.DARK ? <FiMoon /> : <FiSun />}
          </Button>
          
          {/* Language Toggle */}
          <Button
            variant="outline-info"
            size="sm"
            onClick={handleLanguageToggle}
            className="control-btn"
            title={t(`common.${language === LANGUAGES.ENGLISH ? 'arabic' : 'english'}`)}
            aria-label={t(`common.${language === LANGUAGES.ENGLISH ? 'arabic' : 'english'}`)}
          >
            {language === LANGUAGES.ENGLISH ? '🇸🇦' : '🇺🇸'}
          </Button>

          {/* Notifications */}
          {/* <Dropdown className="notification-dropdown">
            <Dropdown.Toggle variant="outline-secondary" id="notification-dropdown" className="notification-btn">
              🔔
              <Badge bg="danger" className="notification-badge">
                3
              </Badge>
            </Dropdown.Toggle>

            <Dropdown.Menu className="notification-menu">
              <Dropdown.Header>{t('navbar.notifications')}</Dropdown.Header>
              <Dropdown.Item href="#action/1">New user registered</Dropdown.Item>
              <Dropdown.Item href="#action/2">System update available</Dropdown.Item>
              <Dropdown.Item href="#action/3">Weekly report ready</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="#action/4">{t('common.viewAll')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}

          {/* User Menu */}
          <Dropdown className="user-dropdown">
            <Dropdown.Toggle variant="outline-primary" id="user-dropdown" className="user-btn">
              <div className="user-avatar " style={{width: '20px', height: '20px'}}>
                <span className="user-avatar-text">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name || 'Admin'}</span>
               
              </div>
             
            </Dropdown.Toggle>

            <Dropdown.Menu className="user-menu " style={{minWidth: '50px'}}>
         
          
              <Dropdown.Item onClick={handleLogout} className="user-menu-item logout-item">
                <span className="user-menu-icon"><FiLogOut /></span>
                <span className="user-menu-text">{t('common.logout')}</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>

      <style jsx>{`
        .top-navbar {
          margin-left: 250px;
          z-index: 999;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .navbar-brand {
          font-weight: bold;
          font-size: 1.2rem;
        }

        .brand-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-logo {
          width: 2rem;
          height: 2rem;
          object-fit: contain;
          filter: brightness(0) saturate(100%) invert(1);
          transition: all 0.3s ease;
        }

        /* Dark theme logo adjustment */
        [data-theme="dark"] .brand-logo {
          filter: brightness(0) saturate(100%) invert(1);
        }

        /* Light theme logo adjustment */
        [data-theme="light"] .brand-logo {
          filter: brightness(0) saturate(100%);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .brand-title {
          font-weight: bold;
          font-size: 1.1rem;
        }

        .brand-subtitle {
          font-size: 0.8rem;
          opacity: 0.7;
          font-weight: normal;
        }

        .navbar-center {
          flex: 1;
          display: flex;
          justify-content: center;
          max-width: 500px;
          margin: 0 auto;
        }

        .search-form {
          width: 100%;
        }

        .search-input {
          border: 2px solid transparent;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .search-input:focus {
          border-color: var(--bs-primary);
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          background: rgba(255, 255, 255, 0.15);
        }

        .search-icon {
          background: transparent;
          border: none;
          color: var(--bs-secondary);
        }

        .search-btn {
          border-radius: 0 8px 8px 0;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-left: auto;
        }

        .notification-dropdown,
        .user-dropdown {
          position: relative;
          padding: 0.5rem 0rem;
        }

        .notification-btn,
        .user-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 2px solid transparent;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          text-decoration: none;
          color: inherit;
        }

        .notification-btn:hover,
        .user-btn:hover {
          border-color: var(--bs-primary);
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-1px);
        }

        .notification-icon {
          font-size: 1.2rem;
        }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          font-size: 0.7rem;
          border-radius: 50%;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .user-role {
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .user-arrow {
          font-size: 0.8rem;
          opacity: 0.7;
          transition: transform 0.3s ease;
        }

        .user-arrow svg {
          width: 0.8rem;
          height: 0.8rem;
        }

        .user-btn[aria-expanded="true"] .user-arrow {
          transform: rotate(180deg);
        }

        .notification-menu,
        .user-menu {
          min-width: 200px;
          margin-top: 0.5rem;
          border: none;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
        }

        .user-menu-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .user-menu-avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .user-menu-info {
          flex: 1;
        }

        .user-menu-name {
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .user-menu-email {
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .user-menu-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: none;
          transition: background-color 0.2s ease;
        }

        .user-menu-item:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .user-menu-icon {
          width: 20px;
          text-align: center;
          font-size: 0.9rem;
        }

        .user-menu-icon svg {
          width: 1rem;
          height: 1rem;
        }

        .user-menu-text {
          flex: 1;
          font-size: 0.9rem;
        }

        .logout-item {
          color: var(--bs-danger);
        }

        .logout-item:hover {
          background-color: rgba(220, 53, 69, 0.1);
        }

        /* Dark theme support */
        [data-theme="dark"] .top-navbar {
          background-color: rgba(39, 49, 66, 0.95) !important;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        [data-theme="dark"] .search-input {
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }

        [data-theme="dark"] .search-input:focus {
          background: rgba(255, 255, 255, 0.1);
        }

        [data-theme="dark"] .notification-btn,
        [data-theme="dark"] .user-btn {
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }

        [data-theme="dark"] .notification-btn:hover,
        [data-theme="dark"] .user-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        [data-theme="dark"] .notification-menu,
        [data-theme="dark"] .user-menu {
          background-color: rgba(42, 42, 42, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        [data-theme="dark"] .user-menu-item:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }

        /* RTL Support */
        [dir="rtl"] .top-navbar {
          margin-right: 250px;
          margin-left: 0;
        }

        [dir="rtl"] .navbar-right {
          margin-right: auto;
          margin-left: 0;
        }

        [dir="rtl"] .brand-content {
          flex-direction: row-reverse;
        }

        [dir="rtl"] .user-btn {
          flex-direction: row-reverse;
        }

        [dir="rtl"] .user-info {
          text-align: right;
        }

        [dir="rtl"] .user-menu-header {
          flex-direction: row-reverse;
        }

        [dir="rtl"] .user-menu-info {
          text-align: right;
        }

        [dir="rtl"] .user-menu-item {
          flex-direction: row-reverse;
        }

        [dir="rtl"] .user-menu-text {
          text-align: right;
        }

        [dir="rtl"] .notification-badge {
          right: auto;
          left: -5px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .top-navbar {
            margin-left: 0;
            margin-right: 0;
          }

          [dir="rtl"] .top-navbar {
            margin-right: 0;
            margin-left: 0;
          }

          .navbar-center {
            display: none;
          }

          .navbar-right {
            gap: 0.5rem;
          }

          .user-info {
            display: none;
          }

          .brand-subtitle {
            display: none;
          }
        }

        @media (max-width: 576px) {
          .notification-btn {
            padding: 0.5rem;
          }

          .user-btn {
            padding: 0.5rem;
          }

          .notification-menu,
          .user-menu {
            min-width: 250px;
          }
        }

        .mobile-menu-btn {
          display: none;
          margin-right: 1rem;
          padding: 0.5rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .mobile-menu-btn:hover {
          border-color: var(--bs-primary);
          background: rgba(255, 255, 255, 0.15);
        }

        .mobile-menu-btn svg {
          width: 1.2rem;
          height: 1.2rem;
        }

        /* RTL support for mobile menu button */
        [dir="rtl"] .mobile-menu-btn {
          margin-right: 0;
          margin-left: 1rem;
        }

        /* Control buttons (theme and language) */
        .control-btn {
          min-width: 35px;
          height: 35px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 2px solid transparent;
        }

        .control-btn:hover {
          transform: scale(1.05);
          border-color: var(--bs-primary);
          background: rgba(255, 255, 255, 0.15);
        }

        .control-btn svg {
          width: 1rem;
          height: 1rem;
        }

        /* Dark theme support for control buttons */
        [data-theme="dark"] .control-btn {
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }

        [data-theme="dark"] .control-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </Navbar>
  );
};

export default TopNavbar; 