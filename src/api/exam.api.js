import api from './axios';


// ---- Admin (exam ids look like "obj-<uid>" / "theory-<uid>") ----
export const listExams = (params) => api.get('/exams', { params });
export const createExam = (data) => api.post('/exams', data);
export const getExamAdmin = (id) => api.get(`/exams/${id}/admin`);
export const setExamOpen = (id, open) => api.put(`/exams/${id}/open`, { open });
export const deleteExam = (id) => api.delete(`/exams/${id}`);
export const listQuestions = (examId) => api.get(`/exams/${examId}/questions`);
export const addQuestion = (examId, data) => api.post(`/exams/${examId}/questions`, data);
export const deleteQuestion = (examId, questionUid) => api.delete(`/exams/${examId}/questions/${questionUid}`);
export const setExamOptions = (id, data) => api.put(`/exams/${id}/options`, data);
export const createPassage = (examId, data) => api.post(`/exams/${examId}/passages`, data);
export const updatePassage = (examId, passageUid, data) => api.put(`/exams/${examId}/passages/${passageUid}`, data);
export const deletePassage = (examId, passageUid) => api.delete(`/exams/${examId}/passages/${passageUid}`);
export const importQuestions = (examId, file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post(`/exams/${examId}/questions/import`, form);
};
export const confirmImportedQuestions = (examId, questions) =>
  api.post(`/exams/${examId}/questions/import/confirm`, { questions });

// ---- Admin: who is in exam mode, and the OK button ----
export const listExamControl = () => api.get('/exams/control');
export const releaseStudents = (attemptIds) => api.post('/exams/control/release', { attemptIds });

// ---- Student ----
export const getExamMode = () => api.get('/exams/mode');
// Operator requests: use the normal login token.
export const availableExams = () =>
  api.get('/exams/room/available');
export const restoreAttempt = () =>
  api.post('/exams/attempts/restore');

export const sendHeartbeat = (attemptId) =>
  api.post(
    `/exams/attempts/${attemptId}/heartbeat`,
    {},
    { authContext: 'examCandidate' }
  );

export const pauseAttempt = (attemptId) =>
  api.post(
    `/exams/attempts/${attemptId}/pause`,
    {},
    { authContext: 'examCandidate' }
  );
export const resumeAttempt = (attemptId) =>
  api.post(`/exams/attempts/${attemptId}/resume`, {}, { authContext: 'examCandidate' });

export const OpenExam = (data) =>
  api.post('/exams/room/open', data);

// Exam-session request: use the exam operator's temporary exam token.
export const startAttempt = (examId, data) =>
  api.post(`/exams/${examId}/start`, data, { authContext: 'examSession' });

// Candidate requests: use the student's attempt token.
export const getExam = (examId) =>
  api.get(`/exams/${examId}`, {
    authContext: 'examCandidate',
  });

export const saveAnswer = (attemptId, questionId, answer) =>
  api.put(
    `/exams/attempts/${attemptId}/answer`,
    { questionId, answer },
    { authContext: 'examCandidate' }
  );

export const submitAttempt = (attemptId) =>
  api.post(`/exams/attempts/${attemptId}/submit`, null, {
    authContext: 'examCandidate',
  });
  // src/api/exam.api.js
export const uploadQuestionImage = (examId, file) => {
  const form = new FormData();
  form.append('image', file);
  return api.post(`/exams/${examId}/questions/images`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};