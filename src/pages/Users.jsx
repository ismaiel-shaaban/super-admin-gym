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
  clearUsersError,
  clearCreateError,
  clearUpdateError,
  clearDeleteError,
  clearAllErrors,
  setCurrentPage
} from '../store/slices/usersSlice';
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
  FiChevronRight
} from 'react-icons/fi';

const Users = () => {
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
    role: 'coach',
  });

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsers({ page: 1 }));
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
      search: searchValue || null 
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      user_name: '',
      email: '',
      phone: '',
      password: '',
      role: 'coach',
    });
  };

  const handleAddUser = async () => {
    try {
      await dispatch(createUser(formData)).unwrap();
      setShowAddModal(false);
      resetForm();
      dispatch(clearCreateError());
      // Refresh current page after adding user
      dispatch(fetchUsers({ page: currentPage, search: searchTerm || null }));
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      user_name: user.user_name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '', // Don't pre-fill password
      role: user.roles?.[0]?.name || 'coach',
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
      dispatch(fetchUsers({ page: currentPage, search: searchTerm || null }));
    } catch (error) {
      console.error('Failed to update user:', error);
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
      dispatch(fetchUsers({ page: currentPage, search: searchTerm || null }));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    dispatch(fetchUsers({ page, search: searchTerm || null }));
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">{t('users.title')}</h4>
        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)}
            className="d-flex align-items-center gap-2"
        >
            <FiUserPlus />
          {t('users.addUser')}
        </Button>
        </Card.Header>
        <Card.Body>
          {/* Error Alerts */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearUsersError())}>
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
                  placeholder={t('common.search')}
                  value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                />
              </InputGroup>
          </div>

          {/* Users Table */}
          <Table responsive striped hover>
              <thead>
                <tr>
                <th>ID</th>
                  <th>{t('users.name')}</th>
                  <th>{t('users.email')}</th>
                <th>{t('users.phone')}</th>
                  <th>{t('users.role')}</th>
                  <th>{t('users.createdAt')}</th>
                  <th>{t('users.actions')}</th>
                </tr>
              </thead>
              <tbody>
              {users.map((user) => (
                  <tr key={user.id}>
                  <td>{user.unique_id || user.id}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="user-avatar">
                        <span>{user.user_name?.charAt(0) || 'U'}</span>
                      </div>
                      <div>
                        <div className="fw-bold">{user.user_name || 'No Name'}</div>
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
                        <Button
                          variant="outline-primary"
                          size="sm"
                        onClick={() => handleEditUser(user)}
                        className="d-flex align-items-center gap-1"
                        >
                        <FiEdit3 />
                          {t('common.edit')}
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                        onClick={() => handleDeleteUser(user)}
                        className="d-flex align-items-center gap-1"
                        >
                        <FiTrash />
                          {t('common.delete')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

          {users.length === 0 && !loading && (
            <div className="text-center py-4">
              <p className="text-muted">No users found</p>
            </div>
          )}

          {/* Pagination */}
          {total > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="pagination-info">
                <small className="text-muted">
                  {t('users.showingResults').replace('{from}', from || 0).replace('{to}', to || 0).replace('{total}', total || 0)}
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

      {/* Add User Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('users.addUser')}</Modal.Title>
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
              <Form.Label>{t('users.name')}</Form.Label>
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
              <Form.Label>{t('users.email')}</Form.Label>
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
                  <Form.Label>{t('users.phone')}</Form.Label>
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
              <Form.Label>{t('users.role')}</Form.Label>
              <Form.Select
                    name="role"
                value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="coach">Coach</option>
                    <option value="trainee">Trainee</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>{t('common.password')}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddUser}
            disabled={createLoading}
          >
            {createLoading ? t('common.loading') : t('common.save')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('users.editUser')}</Modal.Title>
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
              <Form.Label>{t('users.name')}</Form.Label>
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
              <Form.Label>{t('users.email')}</Form.Label>
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
                  <Form.Label>{t('users.phone')}</Form.Label>
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
              <Form.Label>{t('users.role')}</Form.Label>
              <Form.Select
                    name="role"
                value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="coach">Coach</option>
                    <option value="trainee">Trainee</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>{t('common.password')} (Leave blank to keep current)</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Leave blank to keep current password"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpdateUser}
            disabled={updateLoading}
          >
            {updateLoading ? t('common.loading') : t('common.save')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('users.deleteUser')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearDeleteError())}>
              {deleteError}
            </Alert>
          )}
          <p>
            {t('users.confirmDelete')} <strong>{selectedUser?.user_name || 'Unknown'}</strong>? {t('users.deleteWarning')}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDeleteUser}
            disabled={deleteLoading}
          >
            {deleteLoading ? t('common.loading') : t('common.delete')}
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .users-page {
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
      `}</style>
    </div>
  );
};

export default Users; 