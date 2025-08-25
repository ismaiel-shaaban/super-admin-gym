import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, Row, Col, Alert, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { 
  fetchTraineeLedger,
  clearTraineeError,
  clearAllErrors,
  clearTraineeData
} from '../store/slices/traineesLedgerSlice';
import { 
  FiCalendar,
  FiArrowLeft,
  FiDollarSign,
  FiUser,
  FiTrendingUp
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

const TraineesLedgerIndividual = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { traineeId } = useParams();
  
  // Redux state
  const { 
    traineeLedger,
    traineeInfo,
    traineeLoading,
    traineeError,
    traineeMeta
  } = useAppSelector((state) => state.traineesLedger);

  const { language } = useAppSelector((state) => state.language);

  // Local state
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    if (traineeId) {
      dispatch(fetchTraineeLedger({ traineeId, dateFrom, dateTo }));
    }
  }, [dispatch, traineeId, dateFrom, dateTo]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAllErrors());
    };
  }, [dispatch]);

  // Clear trainee data when leaving individual view
  useEffect(() => {
    return () => {
      dispatch(clearTraineeData());
    };
  }, [dispatch]);

  const handleDateFilter = () => {
    if (traineeId) {
      dispatch(fetchTraineeLedger({ traineeId, dateFrom, dateTo }));
    }
  };

  const handleBackToList = () => {
    navigate('/dashboard/trainees-ledger');
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
    }).format(amount);
  };

  const renderTraineeInfo = () => {
    if (!traineeInfo) return null;

    return (
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <FiUser className="me-2" />
            {t('traineesLedger.traineeInfo')}
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <strong>{t('traineesLedger.traineeDetails.name')}:</strong>
                <span className="ms-2">{traineeInfo.user_name || traineeInfo.email || traineeInfo.phone || '-'}</span>
              </div>
              <div className="mb-3">
                <strong>{t('traineesLedger.traineeDetails.email')}:</strong>
                <span className="ms-2">{traineeInfo.email || '-'}</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <strong>{t('traineesLedger.traineeDetails.phone')}:</strong>
                <span className="ms-2">{traineeInfo.phone || '-'}</span>
              </div>
              <div className="mb-3">
                <strong>{t('traineesLedger.traineeDetails.totalSpending')}:</strong>
                <span className="ms-2 fw-bold text-primary">
                  {formatCurrency(traineeInfo.spending?.total || 0)}
                </span>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  if (traineeLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="trainees-ledger-page">
      <Card>
        <Card.Header className="w-100 d-flex justify-content-between align-items-center">
          <div className='w-100 d-flex align-items-center justify-content-between gap-2'>
            <h4 className="mb-0">
              <FiDollarSign className="me-2" />
              {t('traineesLedger.titleIndividual')}
            </h4>
            <Button
              variant="outline-secondary"
              onClick={handleBackToList}
              className="me-3 d-flex align-items-center gap-2"
            >
              <FiArrowLeft />
              {t('traineesLedger.buttons.backToList')}
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Error Alerts */}
          {traineeError && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearTraineeError())}>
              {traineeError}
            </Alert>
          )}

          {/* Date Filter - Always at top */}
          <div className="mb-4">
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>{t('traineesLedger.dateFrom')}</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>{t('traineesLedger.dateTo')}</Form.Label>
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
                  {t('traineesLedger.buttons.filter')}
                </Button>
              </Col>
            </Row>
          </div>

          {/* Trainee Info */}
          {renderTraineeInfo()}

          {/* Subscription Summary */}
          {traineeInfo && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <FiTrendingUp className="me-2" />
                  {t('traineesLedger.subscriptionSummary')}
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <div className="text-center">
                      <div className="h4 text-primary mb-1">
                        {traineeInfo.subscriptions?.total || 0}
                      </div>
                      <small className="text-muted">{t('traineesLedger.totalSubscriptions')}</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <div className="h4 text-success mb-1">
                        {traineeInfo.subscriptions?.active || 0}
                      </div>
                      <small className="text-muted">{t('traineesLedger.activeSubscriptions')}</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <div className="h4 text-warning mb-1">
                        {traineeInfo.spending?.total || '0.000'}
                      </div>
                      <small className="text-muted">{t('traineesLedger.totalSpending')}</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <div className="h4 text-info mb-1">
                        {traineeInfo.coaches?.length || 0}
                      </div>
                      <small className="text-muted">{t('traineesLedger.totalCoaches')}</small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Subscription Details */}
          {traineeInfo && traineeInfo.subscriptions?.details?.length > 0 && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <FiTrendingUp className="me-2" />
                  {t('traineesLedger.subscriptionDetails')}
                </h5>
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>{t('traineesLedger.subscriptionHeaders.course')}</th>
                      <th>{t('traineesLedger.subscriptionHeaders.coach')}</th>
                      <th>{t('traineesLedger.subscriptionHeaders.status')}</th>
                      <th>{t('traineesLedger.subscriptionHeaders.price')}</th>
                      <th>{t('traineesLedger.subscriptionHeaders.dates')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {traineeInfo.subscriptions.details.map((subscription, index) => (
                      <tr key={index}>
                        <td>
                          <div>
                            <div className="fw-bold">{subscription.course_title}</div>
                            <small className="text-muted">ID: {subscription.course_id}</small>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {subscription.coach_name || `Coach ${subscription.coach_id}`}
                          </span>
                        </td>
                        <td>
                          <Badge 
                            bg={
                              subscription.status === 'active' ? 'success' :
                              subscription.status === 'pending' ? 'warning' :
                              subscription.status === 'waiting_for_payment' ? 'info' : 'secondary'
                            }
                          >
                            {t(`traineesLedger.subscriptionStatus.${subscription.status}`)}
                          </Badge>
                        </td>
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
                              {t('traineesLedger.created')}: {formatDate(subscription.created_at)}
                            </small>
                            <br />
                            <small className="text-muted">
                              {t('traineesLedger.ends')}: {formatDate(subscription.ended_at)}
                            </small>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {/* Transaction Summary */}
          {traineeInfo && traineeInfo.subscriptions?.details?.some(sub => sub.transaction) && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <FiDollarSign className="me-2" />
                  {t('traineesLedger.transactionSummary')}
                </h5>
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>{t('traineesLedger.transactionHeaders.subscription')}</th>
                      <th>{t('traineesLedger.transactionHeaders.amount')}</th>
                      <th>{t('traineesLedger.transactionHeaders.status')}</th>
                      <th>{t('traineesLedger.transactionHeaders.date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {traineeInfo.subscriptions.details
                      .filter(subscription => subscription.transaction)
                      .map((subscription, index) => (
                        <tr key={index}>
                          <td>
                            <div>
                              <div className="fw-bold">{subscription.course_title}</div>
                              <small className="text-muted">ID: {subscription.id}</small>
                            </div>
                          </td>
                          <td>
                            <span className="fw-bold text-primary">
                              {formatCurrency(subscription.transaction.amount)}
                            </span>
                          </td>
                          <td>
                            <Badge 
                              bg={
                                subscription.transaction.status === 'completed' ? 'success' :
                                subscription.transaction.status === 'pending' ? 'warning' :
                                subscription.transaction.status === 'failed' ? 'danger' : 'secondary'
                              }
                            >
                              {t(`traineesLedger.transactionStatus.${subscription.transaction.status}`)}
                            </Badge>
                          </td>
                          <td>
                            <small className="text-muted">
                              {formatDate(subscription.transaction.created_at)}
                            </small>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {/* Coaches Information */}
          {traineeInfo && traineeInfo.coaches?.length > 0 && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <FiUser className="me-2" />
                  {t('traineesLedger.coachesInformation')}
                </h5>
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>{t('traineesLedger.coachHeaders.name')}</th>
                      <th>{t('traineesLedger.coachHeaders.subscriptions')}</th>
                      <th>{t('traineesLedger.coachHeaders.spending')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {traineeInfo.coaches.map((coach, index) => (
                      <tr key={index}>
                        <td>
                          <div>
                            <div className="fw-bold">
                              {coach.name || `Coach ${coach.id}`}
                            </div>
                            <small className="text-muted">ID: {coach.id}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fw-bold">
                              {coach.subscriptions?.total || 0} {t('traineesLedger.total')}
                            </div>
                            <small className="text-success">
                              {coach.subscriptions?.active || 0} {t('traineesLedger.active')}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fw-bold text-primary">
                              {formatCurrency(coach.spending?.total || 0)}
                            </div>
                            <small className="text-success">
                              {formatCurrency(coach.spending?.active || 0)} {t('traineesLedger.active')}
                            </small>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
        </Card.Body>
      </Card>

      <style jsx>{`
        .trainees-ledger-page {
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

export default TraineesLedgerIndividual;
