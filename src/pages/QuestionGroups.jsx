import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Row, Col, Alert, Modal, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { 
  fetchQuestionGroups,
  createQuestionGroup,
  deleteQuestionGroup,
  fetchQuestions,
  createQuestion,
  deleteQuestion,
  clearGroupsError,
  clearCreateGroupError,
  clearDeleteGroupError,
  clearQuestionsError,
  clearCreateQuestionError,
  clearDeleteQuestionError,
  clearAllErrors
} from '../store/slices/questionGroupsSlice';
import { 
  FiSearch, 
  FiPlus,
  FiEye,
  FiTrash2,
  FiEdit,
  FiHelpCircle,
  FiArrowLeft,
  FiX,
  FiFileText
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

const QuestionGroups = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { groupId } = useParams();
  
  // Redux state
  const { 
    groups,
    groupsLoading,
    groupsError,
    createGroupLoading,
    createGroupError,
    deleteGroupLoading,
    deleteGroupError,
    questions,
    questionsLoading,
    questionsError,
    createQuestionLoading,
    createQuestionError,
    deleteQuestionLoading,
    deleteQuestionError
  } = useAppSelector((state) => state.questionGroups);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionSearchTerm, setQuestionSearchTerm] = useState('');

  // Form states
  const [groupForm, setGroupForm] = useState({
    title_ar: '',
    title_en: ''
  });

  const [questionForm, setQuestionForm] = useState({
    image: null,
    type: 'multiple_choice',
    description_ar: '',
    description_en: '',
    answers: [
      { description_ar: '', description_en: '' },
      { description_ar: '', description_en: '' }
    ]
  });

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchQuestionGroups());
  }, [dispatch]);

  // Fetch questions when viewing a specific group
  useEffect(() => {
    if (groupId) {
      dispatch(fetchQuestions(groupId));
    }
  }, [dispatch, groupId]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAllErrors());
    };
  }, [dispatch]);

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  const handleQuestionSearch = (searchValue) => {
    setQuestionSearchTerm(searchValue);
  };

  const handleViewGroup = (group) => {
    navigate(`/dashboard/question-groups/${group.id}`);
  };

  const handleBackToGroups = () => {
    navigate('/dashboard/question-groups');
  };

  const handleAddGroup = () => {
    setGroupForm({ title_ar: '', title_en: '' });
    setShowAddGroupModal(true);
  };

  const handleEditGroup = (group) => {
    setGroupForm({
      title_ar: group.title_ar || group.name || '',
      title_en: group.title_en || group.name || ''
    });
    setSelectedGroup(group);
    setShowAddGroupModal(true);
  };

  const handleDeleteGroup = (group) => {
    setSelectedGroup(group);
    setShowDeleteGroupModal(true);
  };

  const handleConfirmDeleteGroup = () => {
    if (selectedGroup) {
      dispatch(deleteQuestionGroup(selectedGroup.id));
      setShowDeleteGroupModal(false);
      setSelectedGroup(null);
    }
  };

  const handleSubmitGroup = () => {
    if (selectedGroup) {
      // Handle edit group (you can add edit functionality later)
      console.log('Edit group:', selectedGroup.id, groupForm);
    } else {
      dispatch(createQuestionGroup(groupForm));
      setShowAddGroupModal(false);
      setGroupForm({ title_ar: '', title_en: '' });
    }
  };

  const handleAddQuestion = () => {
    setQuestionForm({
      image: null,
      type: 'multiple_choice',
      description_ar: '',
      description_en: '',
      answers: [
        { description_ar: '', description_en: '' },
        { description_ar: '', description_en: '' }
      ]
    });
    setShowAddQuestionModal(true);
  };

  const handleEditQuestion = (question) => {
    setQuestionForm({
      image: null,
      type: question.type || 'multiple_choice',
      description_ar: question.description || '',
      description_en: question.description || '',
      answers: question.answers && question.answers.length > 0 ? question.answers.map(answer => ({
        description_ar: answer.description?.ar || '',
        description_en: answer.description?.en || ''
      })) : [
        { description_ar: '', description_en: '' },
        { description_ar: '', description_en: '' }
      ]
    });
    setSelectedQuestion(question);
    setShowAddQuestionModal(true);
  };

  const handleDeleteQuestion = (question) => {
    setSelectedQuestion(question);
    setShowDeleteQuestionModal(true);
  };

  const handleConfirmDeleteQuestion = () => {
    if (selectedQuestion && groupId) {
      dispatch(deleteQuestion({ groupId, questionId: selectedQuestion.id }));
      setShowDeleteQuestionModal(false);
      setSelectedQuestion(null);
    }
  };

  const handleSubmitQuestion = () => {
    if (selectedQuestion) {
      // Handle edit question (you can add edit functionality later)
      console.log('Edit question:', selectedQuestion.id, questionForm);
    } else {
      dispatch(createQuestion({ groupId, questionData: questionForm }));
      setShowAddQuestionModal(false);
      setQuestionForm({
        image: null,
        type: 'multiple_choice',
        description_ar: '',
        description_en: '',
        answers: [
          { description_ar: '', description_en: '' },
          { description_ar: '', description_en: '' }
        ]
      });
    }
  };

  const handleInputChange = (field, value) => {
    setGroupForm(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionInputChange = (field, value) => {
    setQuestionForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setQuestionForm(prev => ({ ...prev, image: file }));
    }
  };

  const handleAnswerChange = (index, field, value) => {
    setQuestionForm(prev => ({
      ...prev,
      answers: prev.answers.map((answer, i) => 
        i === index ? { ...answer, [field]: value } : answer
      )
    }));
  };

  const addAnswer = () => {
    setQuestionForm(prev => ({
      ...prev,
      answers: [...prev.answers, { description_ar: '', description_en: '' }]
    }));
  };

  const removeAnswer = (index) => {
    setQuestionForm(prev => ({
      ...prev,
      answers: prev.answers.filter((_, i) => i !== index)
    }));
  };


  console.log(groups);
  

  // Filter questions based on search term
  const currentQuestions = questions[groupId] || [];
  const filteredQuestions = currentQuestions.filter(question => {
    const searchLower = questionSearchTerm.toLowerCase();
    return (
      question.description?.toLowerCase().includes(searchLower) ||
      question.type?.toLowerCase().includes(searchLower)
    );
  });

  const getQuestionTypeLabel = (type) => {
    return t(`questionGroups.questions.questionTypes.${type}`) || type;
  };

  if (groupsLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="question-groups-page">
      <Card>
        <Card.Header className="w-100 d-flex justify-content-between align-items-center">
          <div className='w-100 d-flex align-items-center justify-content-between gap-2'>
                         <h4 className="mb-0">
               <FiFileText className="me-2" />
               {groupId ? t('questionGroups.questions.title') : t('questionGroups.title')}
             </h4>
            <div className="d-flex gap-2">
              {groupId && (
                <Button
                  variant="outline-secondary"
                  onClick={handleBackToGroups}
                  className="d-flex align-items-center gap-2"
                >
                  <FiArrowLeft />
                  {t('questionGroups.buttons.backToGroups')}
                </Button>
              )}
              {!groupId && (
                <Button
                  variant="primary"
                  onClick={handleAddGroup}
                  className="d-flex align-items-center gap-2"
                >
                  <FiPlus />
                  {t('questionGroups.buttons.addGroup')}
                </Button>
              )}
              {groupId && (
                <Button
                  variant="primary"
                  onClick={handleAddQuestion}
                  className="d-flex align-items-center gap-2"
                >
                  <FiPlus />
                  {t('questionGroups.questions.buttons.addQuestion')}
                </Button>
              )}
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Error Alerts */}
          {groupsError && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearGroupsError())}>
              {groupsError}
            </Alert>
          )}

          {createGroupError && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearCreateGroupError())}>
              {createGroupError}
            </Alert>
          )}

          {deleteGroupError && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearDeleteGroupError())}>
              {deleteGroupError}
            </Alert>
          )}

          {groupId && questionsError[groupId] && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearQuestionsError(groupId))}>
              {questionsError[groupId]}
            </Alert>
          )}

          {groupId && createQuestionError[groupId] && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearCreateQuestionError(groupId))}>
              {createQuestionError[groupId]}
            </Alert>
          )}

          {groupId && deleteQuestionError[groupId] && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearDeleteQuestionError(groupId))}>
              {deleteQuestionError[groupId]}
            </Alert>
          )}

          {/* Search Bar */}
          {!groupId && (
            <div className="mb-3">
              <InputGroup>
                <InputGroup.Text className="search-icon-wrapper">
                  <FiSearch className="search-icon" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder={t('questionGroups.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </InputGroup>
            </div>
          )}

          {groupId && (
            <div className="mb-3">
              <InputGroup>
                <InputGroup.Text className="search-icon-wrapper">
                  <FiSearch className="search-icon" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder={t('questionGroups.questions.searchPlaceholder')}
                  value={questionSearchTerm}
                  onChange={(e) => handleQuestionSearch(e.target.value)}
                />
              </InputGroup>
            </div>
          )}

          {/* Groups Table */}
          {!groupId && (
            <>
              {groups.length > 0 ? (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>{t('questionGroups.tableHeaders.name')} (AR/EN)</th>
                      <th>{t('questionGroups.tableHeaders.description')}</th>
                      
                      <th>{t('questionGroups.tableHeaders.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group, index) => (
                      <tr key={index}>
                        <td>
                          <div className="fw-bold">
                            {group.title_ar || group.title || '-'}
                          </div>
                       
                        </td>
                        <td>
                          <div className="text-muted">
                            {group.description || '-'}
                          </div>
                        </td>
                      
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleViewGroup(group)}
                              className="d-flex align-items-center gap-1"
                            >
                              <FiEye />
                              {t('questionGroups.buttons.viewQuestions')}
                            </Button>
                            {/* <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleEditGroup(group)}
                              className="d-flex align-items-center gap-1"
                            >
                              <FiEdit />
                              {t('common.edit')}
                            </Button> */}
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteGroup(group)}
                              className="d-flex align-items-center gap-1"
                            >
                              <FiTrash2 />
                              {t('common.delete')}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">{t('questionGroups.noGroupsFound')}</p>
                </div>
              )}
            </>
          )}

          {/* Questions Table */}
          {groupId && (
            <>
              {questionsLoading[groupId] ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t('common.loading')}</span>
                  </div>
                </div>
              ) : filteredQuestions.length > 0 ? (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                                             <th>{t('questionGroups.questions.tableHeaders.description')}</th>
                      <th>{t('questionGroups.questions.tableHeaders.type')}</th>
                      <th>{t('questionGroups.questions.tableHeaders.answers')} (AR/EN)</th>
                      <th>{t('questionGroups.questions.tableHeaders.image')}</th>
                      <th>{t('questionGroups.questions.tableHeaders.answersCount')}</th>
                      <th>{t('questionGroups.questions.tableHeaders.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuestions.map((question, index) => (
                      <tr key={index}>
                        <td>
                          <div className="fw-bold">
                            {question.description || '-'}
                          </div>
                        </td>
                        <td>
                          <Badge bg="secondary">{getQuestionTypeLabel(question.type)}</Badge>
                        </td>
                        <td>
                          <div className="text-muted">
                            {question.answers && question.answers.length > 0 ? (
                              <ul className="list-unstyled mb-0">
                                {question.answers.map((answer, optIndex) => (
                                  <li key={optIndex}>
                                    <div className="fw-bold">
                                      {answer.description?.ar || '-'}
                                    </div>
                                    <small className="text-muted">
                                      {answer.description?.en || '-'}
                                    </small>
                                  </li>
                                ))}
                              </ul>
                            ) : '-'}
                          </div>
                        </td>
                        <td>
                          <div className="fw-bold text-success">
                            {question.image ? (
                              <img 
                                src={question.image.url} 
                                alt="Question" 
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                            ) : '-'}
                          </div>
                        </td>
                        <td>
                          <Badge bg="primary">{question.answers?.length || 0}</Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            {/* <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleEditQuestion(question)}
                              className="d-flex align-items-center gap-1"
                            >
                              <FiEdit />
                              {t('common.edit')}
                            </Button> */}
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteQuestion(question)}
                              className="d-flex align-items-center gap-1"
                            >
                              <FiTrash2 />
                              {t('common.delete')}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">{t('questionGroups.questions.noQuestionsFound')}</p>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Group Modal */}
      <Modal show={showAddGroupModal} onHide={() => setShowAddGroupModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedGroup ? t('questionGroups.editGroup') : t('questionGroups.addGroup')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{t('questionGroups.groupForm.titleAr')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('questionGroups.groupForm.titleArPlaceholder')}
                value={groupForm.title_ar}
                onChange={(e) => handleInputChange('title_ar', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('questionGroups.groupForm.titleEn')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('questionGroups.groupForm.titleEnPlaceholder')}
                value={groupForm.title_en}
                onChange={(e) => handleInputChange('title_en', e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddGroupModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmitGroup}
            disabled={createGroupLoading}
          >
            {createGroupLoading ? t('common.loading') : t('common.save')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Group Modal */}
      <Modal show={showDeleteGroupModal} onHide={() => setShowDeleteGroupModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('questionGroups.deleteGroup')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('questionGroups.confirmDeleteGroup')}</p>
          <p className="text-warning">{t('questionGroups.deleteGroupWarning')}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteGroupModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDeleteGroup}
            disabled={deleteGroupLoading}
          >
            {deleteGroupLoading ? t('common.loading') : t('common.delete')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Question Modal */}
      <Modal show={showAddQuestionModal} onHide={() => setShowAddQuestionModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedQuestion ? t('questionGroups.questions.editQuestion') : t('questionGroups.questions.addQuestion')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{t('questionGroups.questions.questionForm.image')}</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('questionGroups.questions.questionForm.type')}</Form.Label>
                  <Form.Select
                    value={questionForm.type}
                    onChange={(e) => handleQuestionInputChange('type', e.target.value)}
                  >
                    <option value="multiple_choice">{t('questionGroups.questions.questionTypes.multiple_choice')}</option>
                    <option value="essay">{t('questionGroups.questions.questionTypes.essay')}</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('questionGroups.questions.questionForm.descriptionAr')}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder={t('questionGroups.questions.questionForm.descriptionArPlaceholder')}
                    value={questionForm.description_ar}
                    onChange={(e) => handleQuestionInputChange('description_ar', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('questionGroups.questions.questionForm.descriptionEn')}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder={t('questionGroups.questions.questionForm.descriptionEnPlaceholder')}
                    value={questionForm.description_en}
                    onChange={(e) => handleQuestionInputChange('description_en', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>
                {t('questionGroups.questions.questionForm.answers')}
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="ms-2"
                  onClick={addAnswer}
                >
                  <FiPlus />
                  {t('questionGroups.questions.questionForm.addAnswer')}
                </Button>
              </Form.Label>
              {questionForm.answers.map((answer, index) => (
                <div key={index} className="border rounded p-3 mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>{t('questionGroups.questions.questionForm.answer')} {index + 1}</strong>
                    {questionForm.answers.length > 1 && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeAnswer(index)}
                      >
                        <FiX />
                      </Button>
                    )}
                  </div>
                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>{t('questionGroups.questions.questionForm.answerAr')}</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={t('questionGroups.questions.questionForm.answerArPlaceholder')}
                          value={answer.description_ar}
                          onChange={(e) => handleAnswerChange(index, 'description_ar', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>{t('questionGroups.questions.questionForm.answerEn')}</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={t('questionGroups.questions.questionForm.answerEnPlaceholder')}
                          value={answer.description_en}
                          onChange={(e) => handleAnswerChange(index, 'description_en', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              ))}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddQuestionModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmitQuestion}
            disabled={createQuestionLoading[groupId]}
          >
            {createQuestionLoading[groupId] ? t('common.loading') : t('common.save')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Question Modal */}
      <Modal show={showDeleteQuestionModal} onHide={() => setShowDeleteQuestionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('questionGroups.questions.deleteQuestion')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('questionGroups.questions.confirmDeleteQuestion')}</p>
          <p className="text-warning">{t('questionGroups.questions.deleteQuestionWarning')}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteQuestionModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDeleteQuestion}
            disabled={deleteQuestionLoading[groupId]}
          >
            {deleteQuestionLoading[groupId] ? t('common.loading') : t('common.delete')}
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .question-groups-page {
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

export default QuestionGroups;
