import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../utils/constants';

// Import pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Coaches from '../pages/Coaches';
import Trainees from '../pages/Trainees';
import Settings from '../pages/Settings';
import Slider from '../pages/Slider';
import Topics from '../pages/Topics';
import CoachesLedger from '../pages/CoachesLedger';
import TraineesLedger from '../pages/TraineesLedger';
import QuestionGroups from '../pages/QuestionGroups';
import DashboardLayout from '../layouts/DashboardLayout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  return children;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD.ROOT} replace />;
  }
  
  return children;
};

// Main Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path={ROUTES.LOGIN} 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />

      {/* Protected Routes - All under dashboard */}
      <Route
        path={ROUTES.DASHBOARD.ROOT}
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Statistics page (default dashboard page) */}
      <Route
        path={ROUTES.DASHBOARD.STATISTICS}
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Users page */}
      <Route
        path={ROUTES.DASHBOARD.USERS}
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Users />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Coaches page */}
      <Route
        path={ROUTES.DASHBOARD.COACHES}
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Coaches />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Trainees page */}
      <Route
        path={ROUTES.DASHBOARD.TRAINEES}
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Trainees />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Reports Page */}
      <Route
        path={ROUTES.DASHBOARD.REPORTS}
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="page-placeholder">
                <h2>Reports Page</h2>
                <p>This page is under construction.</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Analytics Page */}
      <Route
        path={ROUTES.DASHBOARD.ANALYTICS}
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="page-placeholder">
                <h2>Analytics Page</h2>
                <p>This page is under construction.</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Settings Page */}
      <Route
        path={ROUTES.DASHBOARD.SETTINGS}
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Slider Page */}
      <Route
        path={ROUTES.DASHBOARD.SLIDER}
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Slider />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Topics Page */}
                <Route
            path={ROUTES.DASHBOARD.TOPICS}
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Topics />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.DASHBOARD.COACHES_LEDGER}
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CoachesLedger />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path={`${ROUTES.DASHBOARD.COACHES_LEDGER}/:coachId`}
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CoachesLedger />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.DASHBOARD.TRAINEES_LEDGER}
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <TraineesLedger />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path={`${ROUTES.DASHBOARD.TRAINEES_LEDGER}/:traineeId`}
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <TraineesLedger />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Question Groups Page */}
          <Route
            path={ROUTES.DASHBOARD.QUESTION_GROUPS}
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <QuestionGroups />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path={`${ROUTES.DASHBOARD.QUESTION_GROUPS}/:groupId`}
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <QuestionGroups />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

      {/* Profile Page */}
      <Route
        path={ROUTES.DASHBOARD.PROFILE}
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="page-placeholder">
                <h2>Profile Page</h2>
                <p>This page is under construction.</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirects */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD.ROOT} replace />} />
      
      {/* Catch all route - redirect to dashboard */}
      <Route
        path="*"
        element={<Navigate to={ROUTES.DASHBOARD.ROOT} replace />}
      />
    </Routes>
  );
};

export default AppRoutes; 