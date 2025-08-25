import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Badge, Modal, Row, Col, Alert, Pagination } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { 
  fetchUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  restoreUser,
  clearUsersError,
  clearCreateError,
  clearUpdateError,
  clearDeleteError,
  clearRestoreError,
  clearAllErrors,
  setCurrentPage
} from '../store/slices/usersSlice';
import { fetchCountries } from '../store/slices/countriesSlice';
import { 
  FiSearch, 
  FiUser, 
  FiEdit, 
  FiTrash2, 
  FiPlus,
  FiUserPlus,
  FiEdit3,
  FiTrash,
  FiChevronLeft,
  FiChevronRight,
  FiUserCheck
} from 'react-icons/fi';
import { USER_ROLE_IDS } from '../utils/constants';

const Trainees = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { 
    users, 
    loading, 
    error, 
    createLoading, 
    createError, 
    updateLoading, 
    updateError, 
    deleteLoading, 
    deleteError,
    restoreLoading,
    restoreError,
    // Pagination state
    currentPage,
    lastPage,
    perPage,
    total,
    from,
    to,
    links,
    meta
  } = useAppSelector((state) => state.users);

  const { countries, loading: countriesLoading } = useAppSelector((state) => state.countries);
  const { language } = useAppSelector((state) => state.language);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    country_id: '',
    phone_country: '',
    role: USER_ROLE_IDS.TRAINEE,
    birthdate: '',
    gender: '',
  });

  // Fetch trainees and countries on component mount
  useEffect(() => {
    dispatch(fetchUsers({ page: 1, role: USER_ROLE_IDS.TRAINEE }));
    dispatch(fetchCountries());
  }, [dispatch]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAllErrors());
    };
  }, [dispatch]);

  // Handle search with debouncing
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    dispatch(fetchUsers({ 
      page: 1, 
      role: USER_ROLE_IDS.TRAINEE, 
      search: searchValue || null 
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // If country_id is being changed, also update phone_country with the country code
    if (name === 'country_id' && value) {
      const selectedCountry = countries.find(country => country.id == value);
      if (selectedCountry && selectedCountry.country_code) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          phone_country: selectedCountry.country_code,
        }));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      user_name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
      country_id: '',
      phone_country: '',
      role: USER_ROLE_IDS.TRAINEE,
      birthdate: '',
      gender: '',
    });
  };

  const handleAddUser = async () => {
    try {
      await dispatch(createUser(formData)).unwrap();
      setShowAddModal(false);
      resetForm();
      dispatch(clearCreateError());
      // Refresh current page after adding user
      dispatch(fetchUsers({ page: currentPage, role: USER_ROLE_IDS.TRAINEE, search: searchTerm || null }));
    } catch (error) {
      console.error('Failed to create trainee:', error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      user_name: user.user_name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '', // Don't pre-fill password
      password_confirmation: '', // Don't pre-fill password confirmation
      country_id: user.country_id || '',
      phone_country: user.country_code || '',
      role: USER_ROLE_IDS.TRAINEE, // Always set as trainee for this page
      birthdate: user.birthdate || '',
      gender: user.gender || '',
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password; // Don't send empty password
      }
      
      await dispatch(updateUser({ id: selectedUser.id, userData: updateData })).unwrap();
      setShowEditModal(false);
      resetForm();
      setSelectedUser(null);
      dispatch(clearUpdateError());
      // Refresh current page after updating user
      dispatch(fetchUsers({ page: currentPage, role: USER_ROLE_IDS.TRAINEE, search: searchTerm || null }));
    } catch (error) {
      console.error('Failed to update trainee:', error);
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await dispatch(deleteUser(selectedUser.id)).unwrap();
      setShowDeleteModal(false);
      setSelectedUser(null);
      dispatch(clearDeleteError());
      // Refresh current page after deleting user
      dispatch(fetchUsers({ page: currentPage, role: USER_ROLE_IDS.TRAINEE, search: searchTerm || null }));
    } catch (error) {
      console.error('Failed to delete trainee:', error);
    }
  };

  const handleRestoreUser = async (user) => {
    try {
      await dispatch(restoreUser(user.id)).unwrap();
      dispatch(clearRestoreError());
      // Refresh current page after restoring user
      dispatch(fetchUsers({ page: currentPage, role: USER_ROLE_IDS.TRAINEE, search: searchTerm || null }));
    } catch (error) {
      console.error('Failed to restore trainee:', error);
    }
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    dispatch(fetchUsers({ page, role: USER_ROLE_IDS.TRAINEE, search: searchTerm || null }));
  };

  const getRoleBadge = (roles) => {
    if (!roles || roles.length === 0) return <Badge bg="secondary">No Role</Badge>;
    
    const role = roles[0].name;
    switch (role) {
      case 'super_admin':
        return <Badge bg="danger">Super Admin</Badge>;
      case 'admin':
        return <Badge bg="warning">Admin</Badge>;
      case 'coach':
        return <Badge bg="primary">Coach</Badge>;
      case 'user':
        return <Badge bg="info">User</Badge>;
      case 'trainee':
        return <Badge bg="success">Trainee</Badge>;
      default:
        return <Badge bg="secondary">{role}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (lastPage <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= lastPage; i++) {
        items.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // Show first 3 pages + ellipsis + last page
        for (let i = 1; i <= 3; i++) {
          items.push(
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
        items.push(<Pagination.Ellipsis key="ellipsis1" />);
        items.push(
          <Pagination.Item
            key={lastPage}
            active={lastPage === currentPage}
            onClick={() => handlePageChange(lastPage)}
          >
            {lastPage}
          </Pagination.Item>
        );
      } else if (currentPage >= lastPage - 2) {
        // Show first page + ellipsis + last 3 pages
        items.push(
          <Pagination.Item
            key={1}
            active={1 === currentPage}
            onClick={() => handlePageChange(1)}
          >
            1
          </Pagination.Item>
        );
        items.push(<Pagination.Ellipsis key="ellipsis2" />);
        for (let i = lastPage - 2; i <= lastPage; i++) {
          items.push(
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
      } else {
        // Show first page + ellipsis + current page + ellipsis + last page
        items.push(
          <Pagination.Item
            key={1}
            active={1 === currentPage}
            onClick={() => handlePageChange(1)}
          >
            1
          </Pagination.Item>
        );
        items.push(<Pagination.Ellipsis key="ellipsis3" />);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
        items.push(<Pagination.Ellipsis key="ellipsis4" />);
        items.push(
          <Pagination.Item
            key={lastPage}
            active={lastPage === currentPage}
            onClick={() => handlePageChange(lastPage)}
          >
            {lastPage}
          </Pagination.Item>
        );
      }
    }
    
    return items;
  };

  // if (loading) {
  //   return (
  //     <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
  //       <div className="spinner-border text-primary" role="status">
  //         <span className="visually-hidden">Loading...</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="trainees-page">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">{t('trainees.title')}</h4>
          <Button 
            variant="primary" 
            onClick={() =>{

              setShowAddModal(true)
              resetForm();
            } 
          }
            className="d-flex align-items-center gap-2"
          >
            <FiUserPlus />
            {t('trainees.buttons.addTrainee')}
          </Button>
        </Card.Header>
        <Card.Body>
          {/* Error Alerts */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearUsersError())}>
              {error}
            </Alert>
          )}
          {restoreError && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearRestoreError())}>
              {restoreError}
            </Alert>
          )}

          {/* Search Bar */}
          <div className="mb-3">
            <InputGroup>
              <InputGroup.Text className="search-icon-wrapper">
                <FiSearch className="search-icon" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={t('trainees.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Trainees Table */}
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>{t('trainees.tableHeaders.id')}</th>
                <th>{t('trainees.tableHeaders.name')}</th>
                <th>{t('trainees.tableHeaders.email')}</th>
                <th>{t('trainees.tableHeaders.phone')}</th>
                <th>{t('trainees.tableHeaders.role')}</th>
                <th>{t('trainees.tableHeaders.createdAt')}</th>
                <th>{t('trainees.tableHeaders.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.unique_id || user.id}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className={`user-avatar ${user.deleted_at ? 'deleted' : ''}`}>
                        <span>{user.user_name?.charAt(0) || 'U'}</span>
                      </div>
                      <div>
                        <div className={`fw-bold ${user.deleted_at ? 'text-muted' : ''}`}>
                          {user.user_name || 'No Name'}
                          {user.deleted_at && (
                            <Badge bg="secondary" className="ms-2">
                              {t('trainees.deleted')}
                            </Badge>
                          )}
                        </div>
                        <small className="text-muted">ID: {user.id}</small>
                      </div>
                    </div>
                  </td>
                  <td>{user.email || '-'}</td>
                  <td>{user.phone || '-'}</td>
                  <td>{getRoleBadge(user.roles)}</td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      {!user.deleted_at && (
                        <>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            className="d-flex align-items-center gap-1"
                          >
                            <FiEdit3 />
                            {t('trainees.buttons.edit')}
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                            className="d-flex align-items-center gap-1"
                          >
                            <FiTrash />
                            {t('trainees.buttons.delete')}
                          </Button>
                        </>
                      )}
                      {user.deleted_at && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleRestoreUser(user)}
                          className="d-flex align-items-center gap-1"
                          disabled={restoreLoading}
                        >
                          <FiUserCheck />
                          {restoreLoading ? t('trainees.buttons.loading') : t('trainees.buttons.restore')}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {users.length === 0 && !loading && (
            <div className="text-center py-4">
              <p className="text-muted">{t('trainees.noTraineesFound')}</p>
            </div>
          )}

          {/* Pagination */}
          {total > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="pagination-info">
                <small className="text-muted">
                  {t('trainees.showingResults').replace('{from}', from || 0).replace('{to}', to || 0).replace('{total}', total || 0)}
                </small>
              </div>
              
              <Pagination className="mb-0">
                <Pagination.First
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(1)}
                />
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                
                {renderPaginationItems()}
                
                <Pagination.Next
                  disabled={currentPage === lastPage}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
                <Pagination.Last
                  disabled={currentPage === lastPage}
                  onClick={() => handlePageChange(lastPage)}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add Trainee Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header >
          <Modal.Title >{t('trainees.modals.addTitle')}</Modal.Title>
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
                  <Form.Label>{t('trainees.formLabels.name')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('trainees.formLabels.email')}</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('trainees.formLabels.phone')}</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('trainees.formLabels.country')}</Form.Label>
                  <Form.Select
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">{t('trainees.formLabels.selectCountry')}</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name[language === 'ar' ? 'ar' : 'en']}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('trainees.formLabels.birthdate')}</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('trainees.formLabels.gender')}</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">{t('trainees.formLabels.selectGender')}</option>
                    <option value="male">{t('trainees.formLabels.male')}</option>
                    <option value="female">{t('trainees.formLabels.female')}</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('trainees.formLabels.password')}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('trainees.formLabels.passwordConfirmation')}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            {t('trainees.buttons.cancel')}
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddUser}
            disabled={createLoading}
          >
            {createLoading ? t('trainees.buttons.loading') : t('trainees.buttons.save')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Trainee Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header >
          <Modal.Title>{t('trainees.modals.editTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {updateError && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearUpdateError())}>
              {updateError}
            </Alert>
          )}
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('trainees.formLabels.name')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('trainees.formLabels.email')}</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('trainees.formLabels.phone')}</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('trainees.formLabels.country')}</Form.Label>
                  <Form.Select
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">{t('trainees.formLabels.selectCountry')}</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name[language === 'ar' ? 'ar' : 'en']}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('trainees.formLabels.birthdate')}</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('trainees.formLabels.gender')}</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">{t('trainees.formLabels.selectGender')}</option>
                    <option value="male">{t('trainees.formLabels.male')}</option>
                    <option value="female">{t('trainees.formLabels.female')}</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('trainees.formLabels.password')}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={t('trainees.formLabels.passwordPlaceholder')}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('trainees.formLabels.passwordConfirmation')}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            {t('trainees.buttons.cancel')}
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpdateUser}
            disabled={updateLoading}
          >
            {updateLoading ? t('trainees.buttons.loading') : t('trainees.buttons.save')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('trainees.modals.deleteTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearDeleteError())}>
              {deleteError}
            </Alert>
          )}
          <p>
            {t('trainees.confirmDelete')} <strong>{selectedUser?.user_name || 'Unknown'}</strong>?
            {t('trainees.deleteWarning')}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {t('trainees.buttons.cancel')}
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDeleteUser}
            disabled={deleteLoading}
          >
            {deleteLoading ? t('trainees.buttons.loading') : t('trainees.buttons.delete')}
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .trainees-page {
          padding: 1rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1rem;
        }

        .user-avatar.deleted {
          background: linear-gradient(135deg, #6c757d, #495057);
          opacity: 0.7;
        }

        .table th {
          background-color: #f8f9fa;
          border-top: none;
          font-weight: 600;
        }

        .table td {
          vertical-align: middle;
        }

        .pagination-info {
          font-size: 0.9rem;
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

        [data-theme="dark"] .form-control,
        [data-theme="dark"] .form-select {
          background-color: var(--main-dark-lighter);
          border-color: var(--bs-border-color);
          color: #ffffff;
        }

        [data-theme="dark"] .form-control:focus,
        [data-theme="dark"] .form-select:focus {
          background-color: var(--main-dark-lighter);
          border-color: var(--bs-primary);
          color: #ffffff;
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

        [data-theme="dark"] .pagination .page-link {
          background-color: var(--main-dark-lighter);
          border-color: var(--bs-border-color);
          color: #ffffff;
        }

        [data-theme="dark"] .pagination .page-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: var(--bs-primary);
        }

        [data-theme="dark"] .pagination .page-item.active .page-link {
          background-color: var(--bs-primary);
          border-color: var(--bs-primary);
        }

        [data-theme="dark"] .pagination .page-item.disabled .page-link {
          background-color: var(--main-dark-lighter);
          border-color: var(--bs-border-color);
          color: #6c757d;
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

export default Trainees;
