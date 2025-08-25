import React, { useState } from 'react';
import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { ROUTES, APP_CONFIG } from '../utils/constants';
import { 
  FiHome, 
  FiUsers, 
  FiFileText, 
  FiBarChart2, 
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiUserCheck,
  FiUserPlus,
  FiImage,
  FiBookOpen,
  FiDollarSign,
  FiHelpCircle,
  FiClipboard
} from 'react-icons/fi';

const Sidebar = ({ mobileOpen, onMobileToggle }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const theme = useAppSelector((state) => state.theme.theme);
  const language = useAppSelector((state) => state.language.language);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Debug mobile state
  React.useEffect(() => {
    console.log('Mobile state changed - mobileOpen:', mobileOpen, 'isMobile:', isMobile, 'language:', language);
  }, [mobileOpen, isMobile, language]);

  // Debug mobile overlay rendering
  console.log('Rendering sidebar - mobileOpen:', mobileOpen, 'will render overlay:', mobileOpen, 'language:', language, 'isMobile:', isMobile);

  const menuItems = [
    { path: ROUTES.DASHBOARD.STATISTICS, label: t('navigation.dashboard'), icon: <FiHome /> },
    // { path: ROUTES.DASHBOARD.USERS, label: t('navigation.users'), icon: <FiUsers /> },
    { path: ROUTES.DASHBOARD.COACHES, label: t('navigation.coaches'), icon: <FiUserCheck /> },
    { path: ROUTES.DASHBOARD.TRAINEES, label: t('navigation.trainees'), icon: <FiUserPlus /> },
    // { path: ROUTES.DASHBOARD.REPORTS, label: t('navigation.reports'), icon: <FiFileText /> },
    // { path: ROUTES.DASHBOARD.ANALYTICS, label: t('navigation.analytics'), icon: <FiBarChart2 /> },
    { path: ROUTES.DASHBOARD.SETTINGS, label: t('navigation.settings'), icon: <FiSettings /> },
    { path: ROUTES.DASHBOARD.SLIDER, label: t('navigation.slider'), icon: <FiImage /> },
    { path: ROUTES.DASHBOARD.TOPICS, label: t('navigation.topics'), icon: <FiBookOpen /> },
    { path: ROUTES.DASHBOARD.QUESTION_GROUPS, label: t('navigation.questionGroups'), icon: <FiClipboard /> },
    { path: ROUTES.DASHBOARD.COACHES_LEDGER, label: t('navigation.coachesLedger'), icon: <FiDollarSign /> },
    { path: ROUTES.DASHBOARD.TRAINEES_LEDGER, label: t('navigation.traineesLedger'), icon: <FiDollarSign /> },
  ];



  const closeMobileSidebar = () => {
    console.log('closeMobileSidebar called, mobileOpen:', mobileOpen, 'onMobileToggle exists:', !!onMobileToggle);
    if (onMobileToggle && mobileOpen) {
      console.log('Calling onMobileToggle...');
      onMobileToggle();
    } else {
      console.log('Not calling onMobileToggle - conditions not met');
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };




  return (
    <>
      <style jsx>{`
        .sidebar {
          width: 250px;
          height: 100vh;
          background: var(--main-dark);
          color: #ffffff;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 1000;
          overflow-y: auto;
          overflow-x: hidden;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          min-height: 100vh;
        }

        .sidebar.collapsed {
          width: 60px;
        }

        .sidebar.dark {
          background: var(--main-dark);
          color: #ffffff;
          border-right-color: rgba(255, 255, 255, 0.1);
        }

        .sidebar.light {
          background: #f8f9fa;
          color: #212529;
          border-right-color: rgba(0, 0, 0, 0.1);
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          display: none;
          backdrop-filter: blur(2px);
          pointer-events: auto;
        }

        .sidebar-header {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-height: 70px;
          flex-shrink: 0;
        }

        .sidebar.light .sidebar-header {
          border-bottom-color: rgba(0, 0, 0, 0.1);
        }

        .sidebar-title {
          margin: 0;
          font-size: 1.2rem;
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .collapse-btn {
          min-width: 30px;
          height: 30px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .collapse-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .sidebar.light .collapse-btn:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
          overflow-y: auto;
          overflow-x: hidden;
          min-height: 0;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          color: inherit;
          text-decoration: none;
          transition: all 0.2s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          border-radius: 0;
          margin: 0.125rem 0;
        }

        .sidebar-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: inherit;
          transform: translateX(4px);
        }

        .sidebar-link.active {
          background-color: var(--bs-primary);
          color: white;
          transform: translateX(4px);
        }

        .sidebar.light .sidebar-link:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }

        .sidebar-icon {
          margin-right: 0.75rem;
          font-size: 1.2rem;
          min-width: 20px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .sidebar-icon svg {
          width: 1.2rem;
          height: 1.2rem;
        }

        .sidebar-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 500;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          min-height: 80px;
          flex-shrink: 0;
        }

        .sidebar.light .sidebar-footer {
          border-top-color: rgba(0, 0, 0, 0.1);
        }

        .sidebar-controls {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* RTL Support */
        [dir="rtl"] .sidebar {
          right: 0 !important;
          left: auto !important;
          border-right: none !important;
          border-left: 1px solid rgba(255, 255, 255, 0.1) !important;
          background: var(--main-dark) !important;
          color: #ffffff !important;
        }

        [dir="rtl"] .sidebar .sidebar-header {
          border-bottom-color: rgba(255, 255, 255, 0.1) !important;
        }

        [dir="rtl"] .sidebar .sidebar-footer {
          border-top-color: rgba(255, 255, 255, 0.1) !important;
        }

        [dir="rtl"] .sidebar.light {
          border-left-color: rgba(0, 0, 0, 0.1) !important;
          background: #f8f9fa !important;
          color: #212529 !important;
        }

        [dir="rtl"] .sidebar.light .sidebar-header {
          border-bottom-color: rgba(0, 0, 0, 0.1) !important;
        }

        [dir="rtl"] .sidebar.light .sidebar-footer {
          border-top-color: rgba(0, 0, 0, 0.1) !important;
        }

        [dir="rtl"] .sidebar-icon {
          margin-right: 0;
          margin-left: 0.75rem;
        }

        [dir="rtl"] .sidebar-link:hover {
          transform: translateX(-4px);
        }

        [dir="rtl"] .sidebar-link.active {
          transform: translateX(-4px);
        }

        [dir="rtl"] .collapse-btn {
          transform: scaleX(-1);
        }

                /* Mobile styles */
        @media (max-width: 768px) {
          .mobile-overlay {
            display: block !important;
            pointer-events: auto !important;
          }

          .sidebar {
            transform: translateX(-100%);
            width: 280px;
            height: 100vh;
            min-height: 100vh;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
          }
          
          .sidebar.mobile-open {
            transform: translateX(0);
          }
        }

          .sidebar.collapsed {
            width: 280px;
          }

          .sidebar.collapsed .sidebar-title {
            display: block;
          }

          .sidebar.collapsed .sidebar-label {
            display: block;
          }

          .sidebar-header {
            padding: 1.25rem;
          }

          .sidebar-nav {
            padding: 1.25rem 0;
          }

          .sidebar-link {
            padding: 1rem 1.25rem;
            font-size: 1rem;
          }

          .sidebar-footer {
            padding: 1.25rem;
          }
        }

        /* RTL support for mobile - must come after regular mobile styles */
        [dir="rtl"] .sidebar {
          right: 0;
          left: auto;
        }

        /* Ensure mobile overlay works in RTL */
        [dir="rtl"] .mobile-overlay {
          display: block !important;
          pointer-events: auto !important;
          z-index: 999 !important;
        }

        /* RTL large screen styles - ensure sidebar is visible on desktop */
        [dir="rtl"] .sidebar:not(.mobile-open) {
          transform: translateX(0) !important;
        }

        /* RTL mobile styles - hide sidebar by default on mobile */
        [dir="rtl"] @media (max-width: 768px) .sidebar:not(.mobile-open) {
          transform: translateX(100%) !important;
        }

        [dir="rtl"] @media (max-width: 768px) {
          .sidebar {
            transform: translateX(100%) !important;
            right: 0 !important;
            left: auto !important;
            height: 100vh;
            min-height: 100vh;
            box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
          }
          
          .sidebar.mobile-open {
            transform: translateX(0) !important;
          }

          .mobile-overlay {
            left: 0;
            right: 0;
          }
        }

        /* Additional RTL mobile specificity */
        [dir="rtl"] .sidebar.mobile-open {
          transform: translateX(0) !important;
        }

        /* Force RTL mobile positioning */
        [dir="rtl"] .sidebar {
          position: fixed !important;
          right: 0 !important;
          left: auto !important;
        }

        /* Tablet styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .sidebar {
            width: 220px;
          }

          .sidebar.collapsed {
            width: 60px;
          }

          .sidebar-title {
            font-size: 1.1rem;
          }

          .sidebar-link {
            padding: 0.625rem 0.875rem;
          }
        }

        /* Large screen styles */
        @media (min-width: 1025px) {
          .sidebar:hover {
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          }

          [dir="rtl"] .sidebar:hover {
            box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
          }
        }

        /* Accessibility improvements */
        .sidebar-link:focus {
          outline: 2px solid var(--bs-primary);
          outline-offset: -2px;
        }

        .control-btn:focus {
          outline: 2px solid var(--bs-primary);
          outline-offset: 2px;
        }

        /* Smooth scrolling for sidebar nav */
        .sidebar-nav {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }

        .sidebar-nav::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-nav::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }

        .sidebar-nav::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
             {/* Mobile Overlay */}
       {mobileOpen && (
         <div 
           className="mobile-overlay" 
           onClick={(e) => {
             console.log('Mobile overlay clicked! Language:', language);
             e.stopPropagation();
             closeMobileSidebar();
           }}
           style={{
             position: 'fixed',
             top: 0,
             left: 0,
             right: 0,
             bottom: 0,
             background: 'rgba(0, 0, 0, 0.5)',
             zIndex: 999,
             backdropFilter: 'blur(2px)',
             cursor: 'pointer',
             display: 'block',
             pointerEvents: 'auto'
           }}
           title={`Mobile Overlay - Language: ${language}, Mobile: ${isMobile}`}
         ></div>
       )}
      
             <div 
         className={`sidebar ${collapsed ? 'collapsed' : ''} ${theme} ${mobileOpen ? 'mobile-open' : ''}`}
         style={{
           ...(language === 'ar' && {
             position: 'fixed',
             right: 0,
             left: 'auto',
             transform: isMobile ? (mobileOpen ? 'translateX(0)' : 'translateX(100%)') : 'translateX(0)',
             borderRight: 'none',
             borderLeft: theme === 'light' ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)',
             background: theme === 'light' ? '#f8f9fa' : 'var(--main-dark)',
             color: theme === 'light' ? '#212529' : '#ffffff'
           })
         }}
       >
        <div className="sidebar-header">
          <h3 className="sidebar-title">
            {!collapsed && APP_CONFIG.APP_NAME}
          </h3>
          {/* <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-btn"
            aria-label={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </Button> */}
        </div>

        <Nav className="flex-column sidebar-nav">
          {menuItems.map((item) => (
            <Nav.Link
              key={item.path}
              onClick={() => {
                navigate(item.path);
                closeMobileSidebar(); // Close mobile sidebar when navigating
              }}
              className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
              aria-label={item.label}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar-label">{item.label}</span>}
            </Nav.Link>
          ))}
        </Nav>

       
      </div>
    </>
  );
};

export default Sidebar; 