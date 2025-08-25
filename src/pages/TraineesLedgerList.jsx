import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Row, Col, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { 
  fetchTraineesLedger,
  clearLedgerError,
  clearAllErrors
} from '../store/slices/traineesLedgerSlice';
import { 
  FiSearch, 
  FiCalendar,
  FiEye,
  FiDollarSign
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const TraineesLedgerList = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const { 
    ledger, 
    loading, 
    error, 
    meta
  } = useAppSelector((state) => state.traineesLedger);

  const { language } = useAppSelector((state) => state.language);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchTraineesLedger({ dateFrom, dateTo }));
  }, [dispatch, dateFrom, dateTo]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAllErrors());
    };
  }, [dispatch]);

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  const handleDateFilter = () => {
    dispatch(fetchTraineesLedger({ dateFrom, dateTo }));
  };

  const handleViewTrainee = (trainee) => {
    navigate(`/dashboard/trainees-ledger/${trainee.id}`);
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Filter ledger based on search term
  const filteredLedger = ledger.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.trainee?.user_name?.toLowerCase().includes(searchLower) ||
      item.trainee?.email?.toLowerCase().includes(searchLower) ||
      item.trainee?.phone?.toLowerCase().includes(searchLower) ||
      item.spending?.total?.toLowerCase().includes(searchLower)
    );
  });

  const renderLedgerTable = () => (
    <Table responsive striped hover>
      <thead>
        <tr>
          <th>{t('traineesLedger.tableHeaders.trainee')}</th>
          <th>{t('traineesLedger.tableHeaders.subscriptions')}</th>
          <th>{t('traineesLedger.tableHeaders.spending')}</th>
          <th>{t('traineesLedger.tableHeaders.coaches')}</th>
          <th>{t('traineesLedger.tableHeaders.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {filteredLedger.map((item, index) => (
          <tr key={index}>
            <td>
              <div>
                <div className="fw-bold">
                  {item.trainee?.user_name || item.trainee?.email || item.trainee?.phone || '-'}
                </div>
                <small className="text-muted">
                  {item.trainee?.email && item.trainee?.phone ? 
                    `${item.trainee.email} | ${item.trainee.phone}` : 
                    item.trainee?.email || item.trainee?.phone || '-'
                  }
                </small>
              </div>
            </td>
            <td>
              <div>
                <div className="fw-bold">
                  {item.subscriptions?.total || 0} {t('traineesLedger.total')}
                </div>
                <small className="text-success">
                  {item.subscriptions?.active || 0} {t('traineesLedger.active')}
                </small>
              </div>
            </td>
            <td>
              <div>
                <div className="fw-bold text-primary">
                  {formatCurrency(item.spending?.total || 0)}
                </div>
                <small className="text-success">
                  {formatCurrency(item.spending?.active || 0)} {t('traineesLedger.active')}
                </small>
              </div>
            </td>
            <td>
              <div>
                <span className="badge bg-info">
                  {item.coaches?.length || 0} {t('traineesLedger.coaches')}
                </span>
              </div>
            </td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => handleViewTrainee(item.trainee)}
                className="d-flex align-items-center gap-1"
              >
                <FiEye />
                {t('traineesLedger.buttons.view')}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

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
    <div className="trainees-ledger-page">
      <Card>
        <Card.Header className="w-100 d-flex justify-content-between align-items-center">
          <div className='w-100 d-flex align-items-center justify-content-between gap-2'>
            <h4 className="mb-0">
              <FiDollarSign className="me-2" />
              {t('traineesLedger.title')}
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

          {/* Search Bar */}
          <div className="mb-3">
            <InputGroup>
            <InputGroup.Text className="search-icon-wrapper">
            <FiSearch className="search-icon" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={t('traineesLedger.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Ledger Table */}
          {filteredLedger.length > 0 ? (
            renderLedgerTable()
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">{t('traineesLedger.noDataFound')}</p>
            </div>
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
          border-color: var(--bs-border-color);
        }

        [data-theme="dark"] .table td {
          color: #ffffff;
          border-color: var(--bs-border-color);
        }

        [data-theme="dark"] .table {
          border-color: var(--bs-border-color);
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
            /* Search icon styles */
        .search-icon-wrapper {
          background-color: #f8f9fa;
          border-color: #ced4da;
          color: #6c757d;
          transition: all 0.3s ease;
        }

        .search-icon {
          width: 1rem;
          height: 1rem;
          transition: all 0.3s ease;
        }

        /* Dark theme search icon */
        [data-theme="dark"] .search-icon-wrapper {
          background-color: rgba(255, 255, 255, 0.05);
          border-color: var(--bs-border-color);
          color: #ffffff;
        }

        [data-theme="dark"] .search-icon {
          color: #ffffff;
        }

        /* RTL support for search icon */
        [dir="rtl"] .search-icon-wrapper {
          border-left: 1px solid #ced4da;
          border-right: none;
        }

        [dir="rtl"][data-theme="dark"] .search-icon-wrapper {
          border-left-color: var(--bs-border-color);
          border-right: none;
        }
        `}</style>
    </div>
  );
};

export default TraineesLedgerList;
