import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../hooks/useAppSelector';
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
  FiTrendingDown
} from 'react-icons/fi';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const language = useAppSelector((state) => state.language.language);

  const stats = [
    {
      title: t('dashboard.totalUsers'),
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: <FiUsers />,
      color: 'primary',
    },
    {
      title: t('dashboard.activeUsers'),
      value: '892',
      change: '+8%',
      changeType: 'positive',
      icon: <FiCheckCircle />,
      color: 'success',
    },
    {
      title: t('dashboard.newUsers'),
      value: '45',
      change: '+23%',
      changeType: 'positive',
      icon: <FiUserPlus />,
      color: 'info',
    },
    {
      title: t('dashboard.totalRevenue'),
      value: '$12,345',
      change: '+15%',
      changeType: 'positive',
      icon: <FiDollarSign />,
      color: 'warning',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New user registered',
      user: 'John Doe',
      time: '2 minutes ago',
      type: 'user',
    },
    {
      id: 2,
      action: 'System update completed',
      user: 'System',
      time: '1 hour ago',
      type: 'system',
    },
    {
      id: 3,
      action: 'Payment received',
      user: 'Jane Smith',
      time: '3 hours ago',
      type: 'payment',
    },
    {
      id: 4,
      action: 'Report generated',
      user: 'Admin',
      time: '5 hours ago',
      type: 'report',
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user':
        return <FiUser />;
      case 'system':
        return <FiSettings />;
      case 'payment':
        return <FiDollarSign />;
      case 'report':
        return <FiFileText />;
      default:
        return <FiActivity />;
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{t('dashboard.title')}</h1>
        <p className="dashboard-subtitle">{t('dashboard.overview')}</p>
        
      
      </div>

      {/* Statistics Cards */}
      <Row className="mb-4">
        {stats.map((stat, index) => (
          <Col key={index} xs={12} sm={6} lg={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon">
                    <span className="stat-emoji">{stat.icon}</span>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-value">{stat.value}</h3>
                    <p className="stat-title">{stat.title}</p>
                    <Badge 
                      bg={stat.changeType === 'positive' ? 'success' : 'danger'}
                      className="stat-change"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col lg={8} className="mb-4">
          <Card className="activity-card">
            <Card.Header>
              <h5 className="card-title">{t('dashboard.recentActivity')}</h5>
            </Card.Header>
            <Card.Body>
              <div className="activity-list">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>{activity.action}</strong>
                        <span className="activity-user"> by {activity.user}</span>
                      </div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-4">
          <Card className="quick-actions-card">
            <Card.Header>
              <h5 className="card-title">{t('dashboard.quickActions')}</h5>
            </Card.Header>
            <Card.Body>
              <div className="quick-actions-list">
                <button className="quick-action-btn">
                  <span className="action-icon"><FiUserPlus /></span>
                  <span className="action-text">{t('users.addUser')}</span>
                </button>
                <button className="quick-action-btn">
                  <span className="action-icon"><FiFileText /></span>
                  <span className="action-text">{t('navigation.reports')}</span>
                </button>
                <button className="quick-action-btn">
                  <span className="action-icon"><FiSettings /></span>
                  <span className="action-text">{t('common.settings')}</span>
                </button>
                <button className="quick-action-btn">
                  <span className="action-icon"><FiBarChart2 /></span>
                  <span className="action-text">{t('navigation.analytics')}</span>
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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

        .activity-time {
          font-size: 0.8rem;
          color: var(--bs-secondary);
        }

        .quick-actions-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border: none;
          background: var(--bs-light);
          border-radius: 8px;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }

        .quick-action-btn:hover {
          background: var(--bs-primary);
          color: white;
          transform: translateX(5px);
        }

        .action-icon {
          font-size: 1.2rem;
        }

        .action-text {
          font-weight: 500;
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

        [data-theme="dark"] .quick-action-btn {
          background: var(--main-dark);
          color: #ffffff;
        }

        [data-theme="dark"] .quick-action-btn:hover {
          background: var(--bs-primary);
        }

        [data-theme="dark"] .stat-card {
          background-color: var(--main-dark);
          border-color: var(--bs-border-color);
        }

        [data-theme="dark"] .activity-card,
        [data-theme="dark"] .quick-actions-card {
          background-color: var(--main-dark);
          border-color: var(--bs-border-color);
        }

        /* RTL support */
        [dir="rtl"] .quick-action-btn:hover {
          transform: translateX(-5px);
        }
      `}</style>
    </div>
  );
};

export default Dashboard; 