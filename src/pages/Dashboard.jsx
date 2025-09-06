import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Badge, Alert, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { fetchDashboardStatistics, clearDashboardError } from '../store/slices/dashboardSlice';
import { 
  FiUsers, 
  FiCheckCircle, 
  FiUserPlus, 
  FiDollarSign,
  FiUser,
  FiSettings,
  FiFileText,
  FiBarChart2,
  FiActivity,
  FiTrendingUp,
  FiTrendingDown,
  FiBook,
  FiCreditCard,
  FiFilter
} from 'react-icons/fi';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.language.language);
  
  // Dashboard state
  const { statistics, loading, error } = useAppSelector((state) => state.dashboard);

  // Date filter state
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Fetch statistics on component mount
  useEffect(() => {
    dispatch(fetchDashboardStatistics());
    
    // Clear errors when component unmounts
    return () => {
      dispatch(clearDashboardError());
    };
  }, [dispatch]);

  // Handle date filter submission
  const handleDateFilter = () => {
    const dateParams = {};
    if (dateFrom) dateParams.date_from = dateFrom;
    if (dateTo) dateParams.date_to = dateTo;
    
    dispatch(fetchDashboardStatistics(dateParams));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setDateFrom('');
    setDateTo('');
    dispatch(fetchDashboardStatistics());
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    const num = parseFloat(amount);
    return `$${num.toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', text: t('common.pending') },
      active: { variant: 'success', text: t('common.active') },
      finished: { variant: 'secondary', text: t('common.finished') },
      waiting_for_payment: { variant: 'info', text: t('common.waitingForPayment') },
      expired: { variant: 'danger', text: t('common.expired') }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  // Get activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case 'subscription':
        return <FiCreditCard />;
      case 'user_registration':
        return <FiUserPlus />;
      default:
        return <FiActivity />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{t('dashboard.title')}</h1>
        <p className="dashboard-subtitle">{t('dashboard.overview')}</p>
      </div>

      {/* Date Filter Section */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="card-title mb-0">
            <FiFilter className="me-2" />
            {t('dashboard.dateFilter')}
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>{t('dashboard.dateFrom')}</Form.Label>
                <Form.Control
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>{t('dashboard.dateTo')}</Form.Label>
                <Form.Control
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end">
              <div className="d-flex gap-2">
                <Button 
                  variant="primary" 
                  onClick={handleDateFilter}
                  disabled={loading}
                >
                  <FiFilter className="me-1" />
                  {t('dashboard.applyFilter')}
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={handleClearFilters}
                  disabled={loading}
                >
                  {t('dashboard.clearFilter')}
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => dispatch(clearDashboardError())}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      {statistics && (
        <Row className="mb-4">
          {/* Users Statistics */}
          <Col xs={12} sm={6} lg={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon">
                    <span className="stat-emoji"><FiUsers /></span>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-value">{statistics.users?.total_coaches || 0}</h3>
                    <p className="stat-title">{t('dashboard.totalCoaches')}</p>
                    <Badge bg="primary" className="stat-change">
                      {statistics.users?.active_coaches || 0} {t('dashboard.active')}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={6} lg={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon">
                    <span className="stat-emoji"><FiUser /></span>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-value">{statistics.users?.total_trainees || 0}</h3>
                    <p className="stat-title">{t('dashboard.totalTrainees')}</p>
                    <Badge bg="success" className="stat-change">
                      {statistics.users?.active_trainees || 0} {t('dashboard.active')}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Revenue Statistics */}
          <Col xs={12} sm={6} lg={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon">
                    <span className="stat-emoji"><FiDollarSign /></span>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-value">{formatCurrency(statistics.revenue?.total_revenue)}</h3>
                    <p className="stat-title">{t('dashboard.totalRevenue')}</p>
                    <Badge bg="warning" className="stat-change">
                      {formatCurrency(statistics.revenue?.monthly_revenue)} {t('dashboard.monthly')}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={6} lg={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon">
                    <span className="stat-emoji"><FiTrendingUp /></span>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-value">{formatCurrency(statistics.revenue?.active_revenue)}</h3>
                    <p className="stat-title">{t('dashboard.activeRevenue')}</p>
                    <Badge bg="success" className="stat-change">
                      {formatCurrency(statistics.revenue?.average_subscription_value)} {t('dashboard.averageValue')}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Subscription Statistics */}
          <Col xs={12} sm={6} lg={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon">
                    <span className="stat-emoji"><FiBook /></span>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-value">{statistics.subscriptions?.total_subscriptions || 0}</h3>
                    <p className="stat-title">{t('dashboard.totalSubscriptions')}</p>
                    <Badge bg="info" className="stat-change">
                      {statistics.subscriptions?.active_subscriptions || 0} {t('dashboard.active')}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={6} lg={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon">
                    <span className="stat-emoji"><FiBarChart2 /></span>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-value">{statistics.subscriptions?.monthly_subscriptions || 0}</h3>
                    <p className="stat-title">{t('dashboard.monthlySubscriptions')}</p>
                    <Badge bg="warning" className="stat-change">
                      {statistics.subscriptions?.expired_subscriptions || 0} {t('dashboard.expired')}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Recent Activities Count */}
          <Col xs={12} sm={6} lg={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon">
                    <span className="stat-emoji"><FiActivity /></span>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-value">{statistics.recent_activities?.recent_subscriptions?.length || 0}</h3>
                    <p className="stat-title">{t('dashboard.recentSubscriptions')}</p>
                    <Badge bg="primary" className="stat-change">
                      {statistics.recent_activities?.recent_users?.length || 0} {t('dashboard.recentUsers')}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Total Users */}
          <Col xs={12} sm={6} lg={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon">
                    <span className="stat-emoji"><FiUserPlus /></span>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-value">{(statistics.users?.total_coaches || 0) + (statistics.users?.total_trainees || 0)}</h3>
                    <p className="stat-title">{t('dashboard.totalUsers')}</p>
                    <Badge bg="secondary" className="stat-change">
                      {(statistics.users?.active_coaches || 0) + (statistics.users?.active_trainees || 0)} {t('dashboard.active')}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Recent Activities */}
      {statistics && (
        <Row>
          <Col lg={6} className="mb-4">
            <Card className="activity-card">
              <Card.Header>
                <h5 className="card-title">{t('dashboard.recentSubscriptions')}</h5>
              </Card.Header>
              <Card.Body>
                <div className="activity-list">
                  {statistics.recent_activities?.recent_subscriptions?.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="activity-content">
                        <div className="activity-text">
                          <strong>{t('dashboard.newSubscription')}</strong>
                          <span className="activity-user"> {activity.user_name} - {activity.course_title}</span>
                        </div>
                        <div className="activity-details">
                          <span className="activity-amount">{formatCurrency(activity.amount)}</span>
                          <span className="activity-status">{getStatusBadge(activity.status)}</span>
                          <span className="activity-time">{formatDate(activity.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-4">
            <Card className="activity-card">
              <Card.Header>
                <h5 className="card-title">{t('dashboard.recentUsers')}</h5>
              </Card.Header>
              <Card.Body>
                <div className="activity-list">
                  {statistics.recent_activities?.recent_users?.map((user) => (
                    <div key={user.id} className="activity-item">
                      <div className="activity-icon">
                        {getActivityIcon(user.type)}
                      </div>
                      <div className="activity-content">
                        <div className="activity-text">
                          <strong>{t('dashboard.newUser')}</strong>
                          <span className="activity-user"> {user.user_name} ({user.email})</span>
                        </div>
                        <div className="activity-details">
                          <span className="activity-role">
                            <Badge bg={user.role === 'coach' ? 'primary' : 'success'}>
                              {t(`users.${user.role}`)}
                            </Badge>
                          </span>
                          <span className="activity-time">{formatDate(user.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <style jsx>{`
        .dashboard-page {
          padding: 0;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: var(--bs-dark);
        }

        .dashboard-subtitle {
          color: var(--bs-secondary);
          font-size: 1.1rem;
        }

        .stat-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .stat-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--bs-primary), var(--bs-info));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-emoji {
          font-size: 1.5rem;
        }

        .stat-emoji svg {
          width: 1.5rem;
          height: 1.5rem;
          color: white;
        }

        .action-icon svg {
          width: 1.2rem;
          height: 1.2rem;
        }

        .activity-icon svg {
          width: 1.2rem;
          height: 1.2rem;
          color: white;
        }

        .stat-details {
          flex: 1;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: bold;
          margin: 0;
          color: var(--bs-dark);
        }

        .stat-title {
          margin: 0.25rem 0;
          color: var(--bs-secondary);
          font-size: 0.9rem;
        }

        .stat-change {
          font-size: 0.8rem;
        }

        .activity-card,
        .quick-actions-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .card-title {
          margin: 0;
          font-weight: 600;
          color: var(--bs-dark);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 8px;
          background-color: var(--bs-light);
          transition: background-color 0.2s ease;
        }

        .activity-item:hover {
          background-color: var(--bs-gray-200);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: var(--bs-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .activity-content {
          flex: 1;
        }

        .activity-text {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .activity-user {
          color: var(--bs-secondary);
        }

        .activity-details {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
        }

        .activity-amount {
          font-weight: 600;
          color: var(--bs-success);
        }

        .activity-status {
          margin: 0 0.5rem;
        }

                 .activity-time {
           color: var(--bs-secondary);
         }

         .activity-role {
           margin: 0 0.5rem;
         }

        /* Dark theme support */
        [data-theme="dark"] .dashboard-title {
          color: #ffffff;
        }

        [data-theme="dark"] .dashboard-subtitle {
          color: #cccccc;
        }

        [data-theme="dark"] .stat-value {
          color: #ffffff;
        }

        [data-theme="dark"] .stat-title {
          color: #cccccc;
        }

        [data-theme="dark"] .card-title {
          color: #ffffff;
        }

        [data-theme="dark"] .activity-item {
          background-color: var(--main-dark);
        }

        [data-theme="dark"] .activity-item:hover {
          background-color: var(--main-dark-lighter);
        }

                 [data-theme="dark"] .stat-card {
           background-color: var(--main-dark);
           border-color: var(--bs-border-color);
         }

         [data-theme="dark"] .activity-card {
           background-color: var(--main-dark);
           border-color: var(--bs-border-color);
         }
      `}</style>
    </div>
  );
};

export default Dashboard; 