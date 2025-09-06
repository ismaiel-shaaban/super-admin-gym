import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Row, Col, Alert, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { 
  fetchCoachesLedger, 
  fetchCoachLedger,
  clearLedgerError,
  clearCoachError,
  clearAllErrors,
  clearCoachData
} from '../store/slices/coachesLedgerSlice';
import { 
  FiSearch, 
  FiCalendar,
  FiEye,
  FiArrowLeft,
  FiDollarSign,
  FiUser,
  FiTrendingUp,
  FiTrendingDown,
  FiBook,
  FiUsers,
  FiCreditCard
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

const CoachesLedger = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { coachId } = useParams();
  
  // Redux state
  const { 
    ledger, 
    coachLedger,
    coachInfo,
    loading, 
    coachLoading,
    error, 
    coachError,
    meta,
    coachMeta
  } = useAppSelector((state) => state.coachesLedger);

  const { language } = useAppSelector((state) => state.language);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    if (coachId) {
      dispatch(fetchCoachLedger({ coachId, dateFrom, dateTo }));
    } else {
      dispatch(fetchCoachesLedger({ dateFrom, dateTo }));
    }
  }, [dispatch, coachId, dateFrom, dateTo]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAllErrors());
    };
  }, [dispatch]);

  // Clear coach data when leaving individual view
  useEffect(() => {
    if (!coachId) {
      dispatch(clearCoachData());
    }
  }, [coachId, dispatch]);

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  const handleDateFilter = () => {
    if (coachId) {
      dispatch(fetchCoachLedger({ coachId, dateFrom, dateTo }));
    } else {
      dispatch(fetchCoachesLedger({ dateFrom, dateTo }));
    }
  };

  const handleViewCoach = (coach) => {
    navigate(`/dashboard/coaches-ledger/${coach.id}`);
  };

  const handleBackToList = () => {
    navigate('/dashboard/coaches-ledger');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'pending': 'warning',
      'waiting_for_payment': 'info',
      'finished': 'success',
      'active': 'success',
      'under_request': 'secondary',
      'open': 'primary'
    };
    
    return (
      <Badge bg={statusColors[status] || 'secondary'}>
        {t(`coachesLedger.status.${status}`)}
      </Badge>
    );
  };

  // Filter data based on search term
  const filteredData = coachId ? coachLedger : ledger.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.coach?.user_name?.toLowerCase().includes(searchLower) ||
      item.coach?.email?.toLowerCase().includes(searchLower) ||
      item.coach?.phone?.toLowerCase().includes(searchLower) ||
      item.revenue?.total?.toLowerCase().includes(searchLower)
    );
  });

  const renderCoachInfo = () => {
    if (!coachId || !coachLedger?.coach) return null;

    return (
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <FiUser className="me-2" />
            {t('coachesLedger.coachInfo')}
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <strong>{t('coachesLedger.coachDetails.name')}:</strong>
                <span className="ms-2">{coachLedger.coach.user_name || '-'}</span>
              </div>
              <div className="mb-3">
                <strong>{t('coachesLedger.coachDetails.email')}:</strong>
                <span className="ms-2">{coachLedger.coach.email || '-'}</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <strong>{t('coachesLedger.coachDetails.phone')}:</strong>
                <span className="ms-2">{coachLedger.coach.phone || '-'}</span>
              </div>
              <div className="mb-3">
                <strong>{t('coachesLedger.coachDetails.totalRevenue')}:</strong>
                <span className="ms-2 fw-bold text-success">
                  {formatCurrency(coachLedger.revenue?.total || 0)}
                </span>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  const renderRevenueSummary = () => {
    if (!coachId || !coachLedger) return null;

    return (
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <FiDollarSign className="me-2" />
            {t('coachesLedger.overview.coursesSummary')}
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <div className="text-center">
                <div className="h4 text-success mb-1">
                  {formatCurrency(coachLedger.revenue?.total || 0)}
                </div>
                <small className="text-muted">{t('coachesLedger.overview.totalRevenue')}</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <div className="h4 text-primary mb-1">
                  {formatCurrency(coachLedger.revenue?.active || 0)}
                </div>
                <small className="text-muted">{t('coachesLedger.overview.activeRevenue')}</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <div className="h4 text-info mb-1">
                  {coachLedger.subscriptions?.total || 0}
                </div>
                <small className="text-muted">{t('coachesLedger.overview.totalSubscriptions')}</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <div className="h4 text-warning mb-1">
                  {coachLedger.trainees?.length || 0}
                </div>
                <small className="text-muted">{t('coachesLedger.overview.totalTrainees')}</small>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  const renderSubscriptionsDetails = () => {
    if (!coachId || !coachLedger?.subscriptions?.details?.length) return null;

    return (
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <FiCreditCard className="me-2" />
            {t('coachesLedger.subscriptionDetails')}
          </h5>
        </Card.Header>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>{t('coachesLedger.subscriptions.tableHeaders.course')}</th>
                <th>{t('coachesLedger.subscriptions.tableHeaders.trainee')}</th>
                <th>{t('coachesLedger.subscriptions.tableHeaders.status')}</th>
                <th>{t('coachesLedger.subscriptions.tableHeaders.price')}</th>
                <th>{t('coachesLedger.subscriptions.tableHeaders.dates')}</th>
              </tr>
            </thead>
            <tbody>
              {coachLedger.subscriptions.details.map((subscription, index) => (
                <tr key={index}>
                  <td>
                    <div>
                      <div className="fw-bold">{subscription.course_title}</div>
                      <small className="text-muted">ID: {subscription.course_id}</small>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-secondary">
                      {subscription.trainee_name || `Trainee ${subscription.trainee_id}`}
                    </span>
                  </td>
                  <td>{getStatusBadge(subscription.status)}</td>
                  <td>
                    <div>
                      <div className="fw-bold text-primary">
                        {formatCurrency(subscription.price)}
                      </div>
                      {subscription.transaction && (
                        <small className="text-muted">
                          Transaction: {subscription.transaction.status} - {formatCurrency(subscription.transaction.amount)}
                        </small>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      <small className="text-muted">
                        {t('coachesLedger.created')}: {formatDate(subscription.created_at)}
                      </small>
                      <br />
                      <small className="text-muted">
                        {t('coachesLedger.ends')}: {formatDate(subscription.ended_at)}
                      </small>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  const renderCoursesDetails = () => {
    if (!coachId || !coachLedger?.courses?.length) return null;

    return (
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <FiBook className="me-2" />
            {t('coachesLedger.coursesDetails')}
          </h5>
        </Card.Header>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>{t('coachesLedger.courses.tableHeaders.title')}</th>
                <th>{t('coachesLedger.courses.tableHeaders.type')}</th>
                <th>{t('coachesLedger.courses.tableHeaders.status')}</th>
                <th>{t('coachesLedger.courses.tableHeaders.price')}</th>
                <th>{t('coachesLedger.courses.tableHeaders.subscribers')}</th>
                <th>{t('coachesLedger.courses.tableHeaders.revenue')}</th>
              </tr>
            </thead>
            <tbody>
              {coachLedger.courses.map((course) => (
                <tr key={course.id}>
                  <td>
                    <div>
                      <div className="fw-bold">{course.title}</div>
                      <small className="text-muted">ID: {course.id}</small>
                    </div>
                  </td>
                  <td>
                    <Badge bg="info">{course.type}</Badge>
                  </td>
                  <td>{getStatusBadge(course.status)}</td>
                  <td className="fw-bold">{formatCurrency(course.price)}</td>
                  <td>
                    <div>
                      <div>{course.total_subscribers} {t('coachesLedger.courses.total')}</div>
                      <small className="text-success">{course.active_subscribers} {t('coachesLedger.courses.active')}</small>
                    </div>
                  </td>
                  <td className="fw-bold text-success">{formatCurrency(course.total_revenue)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  const renderTraineesDetails = () => {
    if (!coachId || !coachLedger?.trainees?.length) return null;

    return (
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <FiUsers className="me-2" />
            {t('coachesLedger.traineesInformation')}
          </h5>
        </Card.Header>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>{t('coachesLedger.trainees.tableHeaders.name')}</th>
                <th>{t('coachesLedger.trainees.tableHeaders.subscriptions')}</th>
                <th>{t('coachesLedger.trainees.tableHeaders.revenue')}</th>
              </tr>
            </thead>
            <tbody>
              {coachLedger.trainees.map((trainee) => (
                <tr key={trainee.id}>
                  <td>
                    <div>
                      <div className="fw-bold">
                        {trainee.name || `Trainee ${trainee.id}`}
                      </div>
                      <small className="text-muted">ID: {trainee.id}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="fw-bold">
                        {trainee.subscriptions?.total || 0} {t('coachesLedger.trainees.total')}
                      </div>
                      <small className="text-success">
                        {trainee.subscriptions?.active || 0} {t('coachesLedger.trainees.active')}
                      </small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="fw-bold text-primary">
                        {formatCurrency(trainee.revenue?.total || 0)}
                      </div>
                      <small className="text-success">
                        {formatCurrency(trainee.revenue?.active || 0)} {t('coachesLedger.trainees.active')}
                      </small>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  const renderCoachList = () => (
    <Table responsive striped hover>
      <thead>
        <tr>
          <th>{t('coachesLedger.tableHeaders.coach')}</th>
          <th>{t('coachesLedger.tableHeaders.subscriptions')}</th>
          <th>{t('coachesLedger.tableHeaders.revenue')}</th>
          <th>{t('coachesLedger.tableHeaders.courses')}</th>
          <th>{t('coachesLedger.tableHeaders.trainees')}</th>
          <th>{t('coachesLedger.tableHeaders.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((item, index) => (
          <tr key={index}>
            <td>
              <div>
                <div className="fw-bold">
                  {item.coach?.user_name || '-'}
                </div>
                <small className="text-muted">
                  {item.coach?.email || '-'}
                </small>
                <br />
                <small className="text-muted">
                  {item.coach?.phone || '-'}
                </small>
              </div>
            </td>
            <td>
              <div className="fw-bold">{item.subscriptions?.total || 0}</div>
              <small className="text-muted">{item.subscriptions?.active || 0} {t('coachesLedger.active')}</small>
            </td>
            <td>
              <div className="fw-bold text-success">{formatCurrency(item.revenue?.total || 0)}</div>
              <small className="text-muted">{formatCurrency(item.revenue?.active || 0)} {t('coachesLedger.active')}</small>
            </td>
            <td>
              <div className="fw-bold">{item.courses?.length || 0}</div>
              <small className="text-muted">{item.courses?.filter(c => c.status === 'open').length || 0} {t('coachesLedger.open')}</small>
            </td>
            <td>
              <div className="fw-bold">{item.trainees?.length || 0}</div>
            </td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => handleViewCoach(item.coach)}
                className="d-flex align-items-center gap-1"
              >
                <FiEye />
                {t('coachesLedger.buttons.view')}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  if (loading || coachLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="coaches-ledger-page">
      <Card>
        <Card.Header className="w-100 d-flex justify-content-between align-items-center">
          <div className='w-100 d-flex align-items-center justify-content-between gap-2'>
            <h4 className="mb-0">
              <FiDollarSign className="me-2" />
              {coachId ? t('coachesLedger.titleIndividual') : t('coachesLedger.title')}
            </h4>
            {coachId && (
              <Button
                variant="outline-secondary"
                onClick={handleBackToList}
                className="me-3 d-flex align-items-center gap-2"
              >
                <FiArrowLeft />
                {t('coachesLedger.buttons.backToList')}
              </Button>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          {/* Error Alerts */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearLedgerError())}>
              {error}
            </Alert>
          )}

          {coachError && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearCoachError())}>
              {coachError}
            </Alert>
          )}

          {/* Date Filter - Always at top */}
          <div className="mb-4">
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>{t('coachesLedger.dateFrom')}</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>{t('coachesLedger.dateTo')}</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <Button 
                  variant="primary" 
                  onClick={handleDateFilter}
                  className="d-flex align-items-center gap-2"
                >
                  <FiCalendar />
                  {t('coachesLedger.buttons.filter')}
                </Button>
              </Col>
            </Row>
          </div>

          {/* Search Bar */}
          {!coachId && (
            <div className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <FiSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder={t('coachesLedger.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </InputGroup>
            </div>
          )}

          {/* Content based on view */}
          {coachId ? (
            <div>
              {/* Coach Info */}
              {renderCoachInfo()}

              {/* Revenue Summary */}
              {renderRevenueSummary()}

              {/* Subscriptions Details */}
              {renderSubscriptionsDetails()}

              {/* Courses Details */}
              {renderCoursesDetails()}

              {/* Trainees Details */}
              {renderTraineesDetails()}
            </div>
          ) : (
            /* Coach List */
            filteredData.length > 0 ? (
              renderCoachList()
            ) : (
              <div className="text-center py-4">
                <p className="text-muted">{t('coachesLedger.noDataFound')}</p>
              </div>
            )
          )}
        </Card.Body>
      </Card>

      <style jsx>{`
        .coaches-ledger-page {
          padding: 1rem;
        }

        .table th {
          background-color: #f8f9fa;
          border-top: none;
          font-weight: 600;
        }

        .table td {
          vertical-align: middle;
        }

        .transaction-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        /* Dark theme support */
        [data-theme="dark"] .table th {
          background-color: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          border-color: #ffffff !important;
        }

        [data-theme="dark"] .table td {
          color: #ffffff;
          border-color: #ffffff !important;
        }

        [data-theme="dark"] .table {
          border-color: #ffffff !important;
        }

        [data-theme="dark"] .table-striped > tbody > tr:nth-of-type(odd) > td {
          background-color: rgba(255, 255, 255, 0.02);
        }

        [data-theme="dark"] .table-hover > tbody > tr:hover > td {
          background-color: rgba(255, 255, 255, 0.05);
        }

        [data-theme="dark"] .card {
          background-color: var(--main-dark-lighter);
          border-color: var(--bs-border-color);
        }

        [data-theme="dark"] .card-header {
          background-color: rgba(255, 255, 255, 0.05);
          border-bottom-color: var(--bs-border-color);
        }
      `}</style>
    </div>
  );
};

export default CoachesLedger;
