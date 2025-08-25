import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Modal, Row, Col, Alert, Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { 
  fetchSlides, 
  createSlide, 
  deleteSlide,
  clearSliderError,
  clearCreateError,
  clearDeleteError,
  clearAllErrors
} from '../store/slices/sliderSlice';
import { 
  FiSearch, 
  FiUserPlus,
  FiEdit3,
  FiTrash,
  FiImage,
  FiPlus
} from 'react-icons/fi';

const Slider = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { 
    slides, 
    loading, 
    error, 
    createLoading, 
    createError, 
    deleteLoading, 
    deleteError
  } = useAppSelector((state) => state.slider);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch slides on component mount
  useEffect(() => {
    dispatch(fetchSlides());
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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }));
    
    if (file) {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      image: null
    });
    setImagePreview(null);
  };

  const handleAddSlide = async () => {
    try {
      await dispatch(createSlide(formData)).unwrap();
      setShowAddModal(false);
      resetForm();
      dispatch(clearCreateError());
      dispatch(fetchSlides());
    } catch (error) {
      console.error('Failed to create slide:', error);
    }
  };

  const handleDeleteSlide = (slide) => {
    setSelectedSlide(slide);
    setShowDeleteModal(true);
  };

  const confirmDeleteSlide = async () => {
    try {
      await dispatch(deleteSlide(selectedSlide.id)).unwrap();
      setShowDeleteModal(false);
      setSelectedSlide(null);
      dispatch(clearDeleteError());
      dispatch(fetchSlides());
    } catch (error) {
      console.error('Failed to delete slide:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  // Filter slides based on search term
  const filteredSlides = slides.filter(slide =>
    slide.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="slider-page">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">{t('slider.title')}</h4>
          <Button 
            variant="primary" 
            onClick={() => setShowAddModal(true)}
            className="d-flex align-items-center gap-2"
          >
            <FiPlus />
            {t('slider.buttons.addSlide')}
          </Button>
        </Card.Header>
        <Card.Body>
          {/* Error Alerts */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearSliderError())}>
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
                placeholder={t('slider.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Slides Table */}
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>{t('slider.tableHeaders.id')}</th>
                <th>{t('slider.tableHeaders.title')}</th>
                <th>{t('slider.tableHeaders.image')}</th>
                <th>{t('slider.tableHeaders.createdAt')}</th>
                <th>{t('slider.tableHeaders.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSlides.map((slide) => (
                <tr key={slide.id}>
                  <td>{slide.id}</td>
                  <td>{slide.title || '-'}</td>
                  <td>
                    {slide.image && (
                      <Image 
                        src={slide.image?.url} 
                        alt={slide.title}
                        style={{ width: '60px', height: '40px', objectFit: 'cover' }}
                        rounded
                      />
                    )}
                  </td>
                  <td>{formatDate(slide.created_at)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteSlide(slide)}
                        className="d-flex align-items-center gap-1"
                      >
                        <FiTrash />
                        {t('slider.buttons.delete')}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredSlides.length === 0 && !loading && (
            <div className="text-center py-4">
              <p className="text-muted">{t('slider.noSlidesFound')}</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add Slide Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header>
          <Modal.Title>{t('slider.modals.addTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {createError && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearCreateError())}>
              {createError}
            </Alert>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{t('slider.formLabels.title')}</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('slider.formLabels.image')}</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              {imagePreview && (
                <div className="mt-2">
                  <Image 
                    src={imagePreview} 
                    alt="Preview"
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                    rounded
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            {t('slider.buttons.cancel')}
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddSlide}
            disabled={createLoading}
          >
            {createLoading ? t('slider.buttons.loading') : t('slider.buttons.save')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('slider.modals.deleteTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearDeleteError())}>
              {deleteError}
            </Alert>
          )}
          <p>
            {t('slider.confirmDelete')} <strong>{selectedSlide?.title || 'Unknown'}</strong>?
            {t('slider.deleteWarning')}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {t('slider.buttons.cancel')}
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDeleteSlide}
            disabled={deleteLoading}
          >
            {deleteLoading ? t('slider.buttons.loading') : t('slider.buttons.delete')}
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .slider-page {
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

export default Slider;
