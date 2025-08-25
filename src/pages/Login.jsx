import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { loginUser, clearError } from '../store/slices/authSlice';
import { ROUTES, STORAGE_KEYS } from '../utils/constants';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD.ROOT);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    dispatch(clearError());
    
    // Use the real API login
    dispatch(loginUser(formData));
  };

  // Handle successful login
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(ROUTES.DASHBOARD.ROOT);
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="login-page">
      <Container fluid>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card className="login-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="login-title">{t('auth.loginTitle')}</h2>
                  <p className="login-subtitle">{t('auth.loginSubtitle')}</p>
                </div>

                {error && (
                  <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
                    {t('auth.loginError')}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('common.email')}</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t('auth.emailPlaceholder')}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>{t('common.password')}</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t('auth.passwordPlaceholder')}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      label={t('auth.rememberMe')}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 login-btn"
                    disabled={loading}
                  >
                    {loading ? t('common.loading') : t('auth.loginButton')}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <a href="#forgot-password" className="forgot-password-link">
                    {t('auth.forgotPassword')}
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-card {
          border: none;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }

        .login-title {
          color: #333;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          color: #666;
          font-size: 0.9rem;
        }

        /* Form styling */
        .form-label {
          color: #333;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .form-control {
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 1rem;
          background-color: #ffffff;
          color: #333;
          transition: all 0.3s ease;
        }

        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          outline: none;
        }

        .form-control::placeholder {
          color: #6c757d;
          opacity: 0.8;
          font-style: italic;
        }

        .form-control:focus::placeholder {
          color: #adb5bd;
          opacity: 0.6;
        }

        .form-check-label {
          color: #333;
          font-weight: 500;
        }

        .login-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          padding: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .login-btn:disabled {
          transform: none;
          box-shadow: none;
          opacity: 0.7;
        }

        .forgot-password-link {
          color: #667eea;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .forgot-password-link:hover {
          text-decoration: underline;
        }

        /* Dark theme support */
        [data-theme="dark"] .login-card {
          background: rgba(39, 49, 66, 0.95);
          color: #ffffff;
        }

        [data-theme="dark"] .login-title {
          color: #ffffff;
        }

        [data-theme="dark"] .login-subtitle {
          color: #cccccc;
        }

        [data-theme="dark"] .form-label {
          color: #ffffff;
        }

        [data-theme="dark"] .form-control {
          background-color: var(--main-dark-lighter);
          border-color: var(--bs-border-color);
          color: #ffffff;
        }

        [data-theme="dark"] .form-control:focus {
          border-color: var(--bs-primary);
          background-color: var(--main-dark-lighter);
        }

        [data-theme="dark"] .form-control::placeholder {
          color: #aaaaaa;
        }

        [data-theme="dark"] .form-control:focus::placeholder {
          color: #cccccc;
        }

        [data-theme="dark"] .form-check-label {
          color: #ffffff;
        }

        [data-theme="dark"] .forgot-password-link {
          color: var(--bs-primary);
        }

        [data-theme="dark"] .forgot-password-link:hover {
          color: #ffffff;
        }

        /* RTL support */
        [dir="rtl"] .login-card {
          text-align: right;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .login-card {
            margin: 1rem;
            padding: 1rem;
          }
          
          .form-control {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }
      `}</style>
    </div>
  );
};

export default Login; 