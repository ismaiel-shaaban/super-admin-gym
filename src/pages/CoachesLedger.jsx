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
  FiTrendingDown
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
    }).format(amount);
  };

  // Filter ledger based on search term
  const filteredLedger = coachId ? coachLedger : ledger.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.coach?.name?.toLowerCase().includes(searchLower) ||
      item.coach?.email?.toLowerCase().includes(searchLower) ||
      item.coach?.phone?.toLowerCase().includes(searchLower) ||
      item.spending?.total?.toLowerCase().includes(searchLower)
    );
  });

  const renderLedgerTable = () => (
    <Table responsive striped hover>
      <thead>
        <tr>
          <th>{t('coachesLedger.tableHeaders.coach')}</th>
          <th>{t('coachesLedger.tableHeaders.transactionType')}</th>
          <th>{t('coachesLedger.tableHeaders.amount')}</th>
          <th>{t('coachesLedger.tableHeaders.description')}</th>
          <th>{t('coachesLedger.tableHeaders.date')}</th>
          <th>{t('coachesLedger.tableHeaders.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {filteredLedger.map((item, index) => (
          <tr key={index}>
            <td>
              <div>
                <div className="fw-bold">
                  {item.coach?.name || item.coach_name || '-'}
                </div>
                <small className="text-muted">
                  {item.coach?.email || item.coach_email || '-'}
                </small>
              </div>
            </td>
            <td>
              <Badge 
                bg={item.transaction_type === 'credit' ? 'success' : 'danger'}
                className="transaction-badge"
              >
                {item.transaction_type === 'credit' ? (
                  <FiTrendingUp className="me-1" />
                ) : (
                  <FiTrendingDown className="me-1" />
                )}
                {t(`coachesLedger.transactionTypes.${item.transaction_type}`)}
              </Badge>
            </td>
            <td>
              <span className={`fw-bold ${item.transaction_type === 'credit' ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(item.amount)}
              </span>
            </td>
            <td>{item.description || '-'}</td>
            <td>{formatDate(item.created_at || item.date)}</td>
            <td>
              {!coachId && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleViewCoach(item.coach || { id: item.coach_id, name: item.coach_name })}
                  className="d-flex align-items-center gap-1"
                >
                  <FiEye />
                  {t('coachesLedger.buttons.view')}
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderCoachInfo = () => {
    if (!coachInfo) return null;

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
                <span className="ms-2">{coachInfo.name || '-'}</span>
              </div>
              <div className="mb-3">
                <strong>{t('coachesLedger.coachDetails.email')}:</strong>
                <span className="ms-2">{coachInfo.email || '-'}</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <strong>{t('coachesLedger.coachDetails.phone')}:</strong>
                <span className="ms-2">{coachInfo.phone || '-'}</span>
              </div>
              <div className="mb-3">
                <strong>{t('coachesLedger.coachDetails.totalBalance')}:</strong>
                <span className={`ms-2 fw-bold ${(coachInfo.balance || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                  {formatCurrency(coachInfo.balance || 0)}
                </span>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

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
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
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
            <h4 className="mb-0">
              <FiDollarSign className="me-2" />
              {coachId ? t('coachesLedger.titleIndividual') : t('coachesLedger.title')}
            </h4>
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

          {/* Coach Info (for individual view) */}
          {coachId && renderCoachInfo()}

          {/* Date Filter */}
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

          {/* Ledger Table */}
          {filteredLedger.length > 0 ? (
            renderLedgerTable()
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">{t('coachesLedger.noDataFound')}</p>
            </div>
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
        }

        [data-theme="dark"] .table td {
          color: #ffffff;
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
