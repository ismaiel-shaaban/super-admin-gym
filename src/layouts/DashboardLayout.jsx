import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/Navbar';

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar mobileOpen={mobileOpen} onMobileToggle={handleMobileToggle} />
      <div className="dashboard-main">
        <TopNavbar onMobileToggle={handleMobileToggle} />
        <div className="dashboard-content">
          {children}
        </div>
      </div>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          position: relative;
        }

        .dashboard-main {
          flex: 1;
          margin-left: 250px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          transition: all 0.3s ease;
        }

        .dashboard-content {
          flex: 1;
          padding: 2rem;
          margin-top: 70px; /* Height of fixed navbar */
          background: var(--bs-light);
          transition: all 0.3s ease;
          min-height: calc(100vh - 70px);
        }

        /* Dark theme support */
        [data-theme="dark"] .dashboard-content {
          background: var(--main-dark-lighter);
          color: #ffffff;
        }

        /* RTL Support */
        [dir="rtl"] .dashboard-main {
          margin-right: 250px;
          margin-left: 0;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .dashboard-main {
            margin-left: 0;
            margin-right: 0;
            width: 100%;
          }

          [dir="rtl"] .dashboard-main {
            margin-right: 0;
            margin-left: 0;
          }

          .dashboard-content {
            padding: 1rem;
            margin-top: 60px;
          }
        }

        /* Tablet adjustments */
        @media (min-width: 769px) and (max-width: 1024px) {
          .dashboard-main {
            margin-left: 220px;
          }

          [dir="rtl"] .dashboard-main {
            margin-right: 220px;
            margin-left: 0;
          }

          .dashboard-content {
            padding: 1.5rem;
          }
        }

        /* Large screen optimizations */
        @media (min-width: 1025px) {
          .dashboard-content {
            padding: 2.5rem;
          }
        }

        /* Print styles */
        @media print {
          .dashboard-main {
            margin: 0 !important;
          }
          
          .dashboard-content {
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout; 