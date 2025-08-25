import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Modal, Row, Col, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { 
  fetchTopics, 
  createTopic, 
  deleteTopic,
  clearTopicsError,
  clearCreateError,
  clearDeleteError,
  clearAllErrors
} from '../store/slices/topicsSlice';
import { 
  FiSearch, 
  FiUserPlus,
  FiEdit3,
  FiTrash,
  FiBookOpen,
  FiPlus
} from 'react-icons/fi';

const Topics = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { 
    topics, 
    loading, 
    error, 
    createLoading, 
    createError, 
    deleteLoading, 
    deleteError
  } = useAppSelector((state) => state.topics);

  const { language } = useAppSelector((state) => state.language);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [formData, setFormData] = useState({
    name: {
      name_en: '',
      name_ar: ''
    },
    slug: ''
  });

  // Fetch topics on component mount
  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAllErrors());
    };
  }, [dispatch]);

  // Handle search
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'name_en' || name === 'name_ar') {
      setFormData(prev => ({
        ...prev,
        name: {
          ...prev.name,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: {
        name_en: '',
        name_ar: ''
      },
      slug: ''
    });
  };

  const handleAddTopic = async () => {
    try {
      // Prepare the data to send with name_en and name_ar as separate keys
      const topicData = {
        name_en: formData.name.name_en,
        name_ar: formData.name.name_ar,
        slug: formData.slug
      };
      
      await dispatch(createTopic(topicData)).unwrap();
      setShowAddModal(false);
      resetForm();
      dispatch(clearCreateError());
      dispatch(fetchTopics());
    } catch (error) {
      console.error('Failed to create topic:', error);
    }
  };

  const handleDeleteTopic = (topic) => {
    setSelectedTopic(topic);
    setShowDeleteModal(true);
  };

  const confirmDeleteTopic = async () => {
    try {
      await dispatch(deleteTopic(selectedTopic.id)).unwrap();
      setShowDeleteModal(false);
      setSelectedTopic(null);
      dispatch(clearDeleteError());
      dispatch(fetchTopics());
    } catch (error) {
      console.error('Failed to delete topic:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  // Filter topics based on search term
  const filteredTopics = topics.filter(topic => {
    const searchLower = searchTerm.toLowerCase();
    return (
      topic.name?.name_en?.toLowerCase().includes(searchLower) ||
      topic.name?.name_ar?.toLowerCase().includes(searchLower) ||
      topic.slug?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="topics-page">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">{t('topics.title')}</h4>
          <Button 
            variant="primary" 
            onClick={() => setShowAddModal(true)}
            className="d-flex align-items-center gap-2"
          >
            <FiPlus />
            {t('topics.buttons.addTopic')}
          </Button>
        </Card.Header>
        <Card.Body>
          {/* Error Alerts */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearTopicsError())}>
              {error}
            </Alert>
          )}

          {/* Search Bar */}
          <div className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <FiSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={t('topics.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Topics Table */}
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>{t('topics.tableHeaders.id')}</th>
                <th>{t('topics.tableHeaders.name')}</th>
                <th>{t('topics.tableHeaders.slug')}</th>
                <th>{t('topics.tableHeaders.createdAt')}</th>
                <th>{t('topics.tableHeaders.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopics.map((topic) => (
                <tr key={topic.id}>
                  <td>{topic.id}</td>
                  <td>
                    <div>
                      <div className="fw-bold">
                        {topic.name?.[language === 'ar' ? 'name_ar' : 'name_en'] || '-'}
                      </div>
                      <small className="text-muted">
                        {topic.name?.name_en && topic.name?.name_ar && (
                          <>
                            {topic.name.name_en} / {topic.name.name_ar}
                          </>
                        )}
                      </small>
                    </div>
                  </td>
                  <td>
                    <code>{topic.slug || '-'}</code>
                  </td>
                  <td>{formatDate(topic.created_at)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteTopic(topic)}
                        className="d-flex align-items-center gap-1"
                      >
                        <FiTrash />
                        {t('topics.buttons.delete')}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredTopics.length === 0 && !loading && (
            <div className="text-center py-4">
              <p className="text-muted">{t('topics.noTopicsFound')}</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add Topic Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header>
          <Modal.Title>{t('topics.modals.addTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {createError && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearCreateError())}>
              {createError}
            </Alert>
          )}
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('topics.formLabels.nameEn')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name_en"
                    value={formData.name.name_en}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('topics.formLabels.nameAr')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name_ar"
                    value={formData.name.name_ar}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>{t('topics.formLabels.slug')}</Form.Label>
              <Form.Control
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                placeholder="e.g., pushup"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            {t('topics.buttons.cancel')}
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddTopic}
            disabled={createLoading}
          >
            {createLoading ? t('topics.buttons.loading') : t('topics.buttons.save')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('topics.modals.deleteTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearDeleteError())}>
              {deleteError}
            </Alert>
          )}
          <p>
            {t('topics.confirmDelete')} <strong>
              {selectedTopic?.name?.[language === 'ar' ? 'name_ar' : 'name_en'] || 'Unknown'}
            </strong>?
            {t('topics.deleteWarning')}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {t('topics.buttons.cancel')}
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDeleteTopic}
            disabled={deleteLoading}
          >
            {deleteLoading ? t('topics.buttons.loading') : t('topics.buttons.delete')}
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .topics-page {
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

        code {
          background-color: #f8f9fa;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }

        /* Dark theme support */
        [data-theme="dark"] .table th {
          background-color: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }

        [data-theme="dark"] .table td {
          color: #ffffff;
        }

        [data-theme="dark"] code {
          background-color: rgba(255, 255, 255, 0.1);
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

        [data-theme="dark"] .modal-content {
          background-color: var(--main-dark-lighter);
          border-color: var(--bs-border-color);
        }

        [data-theme="dark"] .modal-header {
          border-bottom-color: var(--bs-border-color);
        }

        [data-theme="dark"] .modal-footer {
          border-top-color: var(--bs-border-color);
        }
      `}</style>
    </div>
  );
};

export default Topics;
