import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Button, Alert, Row, Col, Image, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { 
  fetchSettings, 
  updateSettings,
  clearSettingsError,
  clearUpdateError,
  clearAllErrors
} from '../store/slices/settingsSlice';
import { 
  FiUpload, 
  FiTrash2, 
  FiImage,
  FiSave,
  FiX,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi';

const Settings = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { 
    settings, 
    loading, 
    error, 
    updateLoading, 
    updateError 
  } = useAppSelector((state) => state.settings);

  // Local state
  const [formData, setFormData] = useState({
    home_screen: null,
    splash_screen: [],
    exercise_screen: null,
    images_to_delete: []
  });

  // File preview states
  const [homeScreenPreview, setHomeScreenPreview] = useState(null);
  const [splashScreenPreviews, setSplashScreenPreviews] = useState([]);
  const [exerciseScreenPreview, setExerciseScreenPreview] = useState(null);

  // Success message state
  const [showSuccess, setShowSuccess] = useState(false);

  // Drag and drop states
  const [dragStates, setDragStates] = useState({
    home_screen: false,
    splash_screen: false,
    exercise_screen: false
  });

  // File input refs
  const homeScreenRef = useRef(null);
  const splashScreenRef = useRef(null);
  const exerciseScreenRef = useRef(null);

  // Fetch settings on component mount
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAllErrors());
    };
  }, [dispatch]);

  // Debug: Log settings data to understand the structure
  useEffect(() => {
    if (settings) {
      console.log('Settings data:', settings);
    }
  }, [settings]);

  const handleFileChange = (e, field) => {
    const files = e.target.files;
    
    if (field === 'splash_screen') {
      // Handle multiple files for splash screen
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        splash_screen: fileArray
      }));
      
      // Create previews
      const previews = fileArray.map(file => URL.createObjectURL(file));
      setSplashScreenPreviews(previews);
    } else {
      // Handle single file
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
      
      // Create preview
      if (file) {
        const preview = URL.createObjectURL(file);
        if (field === 'home_screen') {
          setHomeScreenPreview(preview);
        } else if (field === 'exercise_screen') {
          setExerciseScreenPreview(preview);
        }
      }
    }
  };

  const handleDragOver = (e, field) => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [field]: true }));
  };

  const handleDragLeave = (e, field) => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [field]: false }));
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [field]: false }));
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (field === 'splash_screen') {
        const fileArray = Array.from(files);
        setFormData(prev => ({
          ...prev,
          splash_screen: fileArray
        }));
        
        const previews = fileArray.map(file => URL.createObjectURL(file));
        setSplashScreenPreviews(previews);
      } else {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          setFormData(prev => ({
            ...prev,
            [field]: file
          }));
          
          const preview = URL.createObjectURL(file);
          if (field === 'home_screen') {
            setHomeScreenPreview(preview);
          } else if (field === 'exercise_screen') {
            setExerciseScreenPreview(preview);
          }
        }
      }
    }
  };

  const handleImageDelete = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images_to_delete: [...prev.images_to_delete, imageId]
    }));
  };

  // Check if an image is marked for deletion
  const isImageMarkedForDeletion = (imageId) => {
    return formData.images_to_delete.includes(imageId);
  };

  const removePreview = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'splash_screen' ? [] : null
    }));
    
    if (field === 'home_screen') {
      setHomeScreenPreview(null);
    } else if (field === 'exercise_screen') {
      setExerciseScreenPreview(null);
    } else if (field === 'splash_screen') {
      setSplashScreenPreviews([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare the data to send, including the key from current settings
      const updateData = {
        ...formData,
        key: settings?.key || 'app_images' // Use the key from current settings or default
      };
      
      await dispatch(updateSettings(updateData)).unwrap();
      // Reset form after successful update
      setFormData({
        home_screen: null,
        splash_screen: [],
        exercise_screen: null,
        images_to_delete: []
      });
      setHomeScreenPreview(null);
      dispatch(fetchSettings());
      setSplashScreenPreviews([]);
      setExerciseScreenPreview(null);
      dispatch(clearUpdateError());
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000); // Hide after 5 seconds
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const renderImagePreview = (imageUrl, alt, onDelete = null, isNew = false) => {
    if (!imageUrl) return null;
    
    return (
      <div className={`image-preview-container ${isNew ? 'new-image' : ''}`}>
        <Image 
          src={imageUrl} 
          alt={alt} 
          className="image-preview"
          fluid
        />
        <div className="image-overlay">
          {isNew && (
            <Badge bg="success" className="new-badge">
              <FiCheck /> {t('settings.newImage')}
            </Badge>
          )}
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              className="delete-image-btn"
              onClick={onDelete}
              title={t('settings.removeImage')}
            >
              <FiTrash2 />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderUploadArea = (field, label, multiple = false, currentPreview = null, currentPreviews = []) => {
    const isDragActive = dragStates[field];
    const hasPreview = currentPreview || (multiple && currentPreviews.length > 0);
    
    return (
      <div className="upload-area-container">
        <Form.Label className="upload-label">
          <FiImage className="upload-icon" />
          {label}
        </Form.Label>
        
        <div
          className={`upload-area ${isDragActive ? 'drag-active' : ''} ${hasPreview ? 'has-preview' : ''}`}
          onDragOver={(e) => handleDragOver(e, field)}
          onDragLeave={(e) => handleDragLeave(e, field)}
          onDrop={(e) => handleDrop(e, field)}
          onClick={() => {
            if (field === 'home_screen') homeScreenRef.current?.click();
            else if (field === 'splash_screen') splashScreenRef.current?.click();
            else if (field === 'exercise_screen') exerciseScreenRef.current?.click();
          }}
        >
          {!hasPreview ? (
            <div className="upload-placeholder">
              <FiUpload className="upload-placeholder-icon" />
              <p className="upload-text">{t('settings.dragDropText')}</p>
              <p className="upload-subtext">{t('settings.clickToBrowse')}</p>
              <Badge bg="secondary" className="file-type-badge">
                {t('settings.imageFilesOnly')}
              </Badge>
            </div>
          ) : (
            <div className="preview-container">
              {multiple ? (
                <Row>
                  {currentPreviews.map((preview, index) => (
                    <Col key={index} md={4} className="mb-3">
                      {renderImagePreview(preview, `${label} ${index + 1}`, null, true)}
                    </Col>
                  ))}
                </Row>
              ) : (
                renderImagePreview(currentPreview, label, null, true)
              )}
            </div>
          )}
          
          <Form.Control
            ref={field === 'home_screen' ? homeScreenRef : field === 'splash_screen' ? splashScreenRef : exerciseScreenRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={(e) => handleFileChange(e, field)}
            className="hidden-file-input"
          />
        </div>
        
        {hasPreview && (
          <Button
            variant="outline-danger"
            size="sm"
            className="remove-preview-btn"
            onClick={() => removePreview(field)}
          >
            <FiX /> {t('settings.removeImage')}
          </Button>
        )}
      </div>
    );
  };

  const renderCurrentImages = (images, title) => {
    // Handle different data structures
    let imageArray = [];
    
    if (Array.isArray(images)) {
      imageArray = images;
    } else if (images && typeof images === 'object') {
      // If it's an object with url property, treat it as a single image
      if (images.url || images.id) {
        imageArray = [images];
      }
    } else if (images && typeof images === 'string') {
      // If it's a string URL, treat it as a single image
      imageArray = [{ url: images, id: 0 }];
    }
    
    // Filter out images that are marked for deletion
    const visibleImages = imageArray.filter((image, index) => {
      const imageId = image.id || index;
      return !isImageMarkedForDeletion(imageId);
    });
    
    if (visibleImages.length === 0) return null;
    
    return (
      <div className="current-images-section">
        <div className="section-header">
          <h6 className="section-title">
            <FiImage className="section-icon" />
            {title}
          </h6>
          <div className="badge-container">
            <Badge bg="info" className="image-count-badge">
              {visibleImages.length} {t('settings.imageCount', { count: visibleImages.length })}
            </Badge>
            {formData.images_to_delete.length > 0 && (
              <Badge bg="warning" className="deletion-count-badge">
                {formData.images_to_delete.length} {t('settings.markedForDeletion')}
              </Badge>
            )}
          </div>
        </div>
        <Row>
          {visibleImages.map((image, index) => (
            <Col key={index} md={4} className="mb-3">
              {renderImagePreview(
                image.url || image,
                `${title} ${index + 1}`,
                () => handleImageDelete(image.id || index)
              )}
            </Col>
          ))}
        </Row>
      </div>
    );
  };

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
    <div className="settings-page">
      <Card className="settings-card">
        <Card.Header className="settings-header">
          <div className="header-content">
            <h4 className="header-title">
              <FiImage className="header-icon" />
              {t('settings.title')}
            </h4>
            <p className="header-subtitle">{t('settings.subtitle')}</p>
          </div>
        </Card.Header>
        <Card.Body className="settings-body">
          {/* Error Alerts */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearSettingsError())}>
              <FiAlertCircle className="alert-icon" />
              {error}
            </Alert>
          )}

          {updateError && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearUpdateError())}>
              <FiAlertCircle className="alert-icon" />
              {updateError}
            </Alert>
          )}

          {showSuccess && (
            <Alert variant="success" dismissible onClose={() => setShowSuccess(false)}>
              <FiCheck className="alert-icon" />
              {t('settings.settingsUpdated')}
            </Alert>
          )}

       

          <Form onSubmit={handleSubmit} className="settings-form">
            {/* Current Images Section */}
            {settings && (
              <div className="current-images-wrapper">
                <h5 className="section-main-title">{t('settings.currentImages')}</h5>
                {renderCurrentImages(settings.home_screen, t('settings.formLabels.homeScreen'))}
                {renderCurrentImages(settings.splash_screen, t('settings.formLabels.splashScreen'))}
                {renderCurrentImages(settings.exercise_screen, t('settings.formLabels.exerciseScreen'))}
              </div>
            )}

            {/* Upload New Images Section */}
            <div className="upload-section">
              <h5 className="section-main-title">
                <FiUpload className="section-icon" />
                {t('settings.uploadNewImages')}
              </h5>
              
              {/* Home Screen Image */}
              <div className="upload-group">
                {renderUploadArea('home_screen', t('settings.formLabels.homeScreen'), false, homeScreenPreview)}
              </div>

              {/* Splash Screen Images */}
              <div className="upload-group">
                {renderUploadArea('splash_screen', t('settings.formLabels.splashScreen'), true, null, splashScreenPreviews)}
              </div>

              {/* Exercise Screen Image */}
              <div className="upload-group">
                {renderUploadArea('exercise_screen', t('settings.formLabels.exerciseScreen'), false, exerciseScreenPreview)}
              </div>
            </div>

            {/* Submit Button */}
            <div className="submit-section">
              <Button 
                variant="primary" 
                type="submit"
                disabled={updateLoading || !settings?.id}
                className="submit-button"
                size="lg"
              >
                <FiSave className="submit-icon" />
                {updateLoading ? t('settings.buttons.loading') : t('settings.buttons.update')}
              </Button>
              {!settings?.id && (
                <small className="text-muted d-block mt-2">
                  {t('settings.waitingForData')}
                </small>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      <style jsx>{`
        .settings-page {
         
          min-height: 100vh;
         
        }

        .settings-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .settings-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 2rem;
        }

        .header-content {
          text-align: center;
        }

        .header-title {
          margin: 0;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .header-icon {
          font-size: 1.5rem;
        }

        .header-subtitle {
          margin: 0.5rem 0 0 0;
          opacity: 0.9;
          font-size: 0.95rem;
        }

        .settings-body {
          padding: 2rem;
        }

        .section-main-title {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-icon {
          color: #667eea;
        }

        .current-images-wrapper {
          margin-bottom: 3rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 12px;
          border: 1px solid #e9ecef;
        }

        .current-images-section {
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-title {
          margin: 0;
          font-weight: 600;
          color: #495057;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .badge-container {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .image-count-badge {
          font-size: 0.8rem;
        }

        .deletion-count-badge {
          font-size: 0.8rem;
        }

        .upload-section {
          margin-bottom: 2rem;
        }

        .upload-group {
          margin-bottom: 2rem;
        }

        .upload-area-container {
          position: relative;
        }

        .upload-label {
          font-weight: 600;
          color: #495057;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .upload-icon {
          color: #667eea;
        }

        .upload-area {
          border: 2px dashed #dee2e6;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          background: #ffffff;
          position: relative;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-area:hover {
          border-color: #667eea;
          background-color: rgba(102, 126, 234, 0.05);
          transform: translateY(-2px);
        }

        .upload-area.drag-active {
          border-color: #667eea;
          background-color: rgba(102, 126, 234, 0.1);
          transform: scale(1.02);
        }

        .upload-area.has-preview {
          padding: 1rem;
          min-height: auto;
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .upload-placeholder-icon {
          font-size: 3rem;
          color: #adb5bd;
        }

        .upload-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #495057;
          margin: 0;
        }

        .upload-subtext {
          font-size: 0.9rem;
          color: #6c757d;
          margin: 0;
        }

        .file-type-badge {
          font-size: 0.8rem;
        }

        .hidden-file-input {
          display: none;
        }

        .preview-container {
          width: 100%;
        }

        .image-preview-container {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .image-preview-container:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .image-preview-container.new-image {
          border: 2px solid #28a745;
        }

        .image-preview {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(0,0,0,0.3) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 0.75rem;
        }

        .image-preview-container:hover .image-overlay {
          opacity: 1;
        }

        .new-badge {
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .delete-image-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .remove-preview-btn {
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .submit-section {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e9ecef;
        }

        .submit-button {
          padding: 0.75rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .alert-icon {
          margin-right: 0.5rem;
        }

    

        [data-theme="dark"] .settings-card {
          background-color: var(--main-dark-lighter);
          border-color: var(--bs-border-color);
        }

        [data-theme="dark"] .settings-header {
          background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
        }

        [data-theme="dark"] .current-images-wrapper {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--bs-border-color);
        }

        [data-theme="dark"] .section-main-title,
        [data-theme="dark"] .section-title,
        [data-theme="dark"] .upload-label {
          color: #e2e8f0;
        }

        [data-theme="dark"] .upload-area {
          background-color: var(--main-dark-lighter);
          border-color: var(--bs-border-color);
          color: #e2e8f0;
        }

        [data-theme="dark"] .upload-area:hover {
          background-color: rgba(102, 126, 234, 0.15);
        }

        [data-theme="dark"] .upload-area.drag-active {
          background-color: rgba(102, 126, 234, 0.2);
        }

        [data-theme="dark"] .upload-text {
          color: #e2e8f0;
        }

        [data-theme="dark"] .upload-subtext {
          color: #a0aec0;
        }

        [data-theme="dark"] .image-preview-container {
          background: var(--main-dark-lighter);
        }

        [data-theme="dark"] .submit-section {
          border-top-color: var(--bs-border-color);
        }

        /* RTL Support */
        [dir="rtl"] .header-title,
        [dir="rtl"] .section-main-title,
        [dir="rtl"] .section-title,
        [dir="rtl"] .upload-label {
          flex-direction: row-reverse;
        }

        [dir="rtl"] .section-header {
          flex-direction: row-reverse;
        }

        [dir="rtl"] .image-overlay {
          flex-direction: row-reverse;
        }

        [dir="rtl"] .submit-button {
          flex-direction: row-reverse;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .settings-page {
            padding: 1rem;
          }

          .settings-body {
            padding: 1.5rem;
          }

          .settings-header {
            padding: 1.5rem;
          }

          .upload-area {
            padding: 1.5rem;
            min-height: 150px;
          }

          .image-preview {
            height: 150px;
          }
        }
      `}</style>
    </div>
  );
};

export default Settings;
