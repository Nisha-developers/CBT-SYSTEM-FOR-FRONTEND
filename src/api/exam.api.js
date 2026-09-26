import api from './axios';

// Admin
export const listExams = (params) => api.get('/exams', { params });
export const createExam = (data) => api.post('/exams', data);
export const getExam = (id) => api.get(`/exams/${id}`);
export const publishExam = (id) => api.put(`/exams/${id}/publish`);
export const addQuestion = (examId, data) => api.post(`/exams/${examId}/questions`, data);

export const importQuestions = (examId, file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post(`/exams/${examId}/questions/import`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const confirmImportedQuestions = (examId, questions) =>
  api.post(`/exams/${examId}/questions/import/confirm`, { questions });

// Student
export const availableExams = () => api.get('/exams/available');
export const startAttempt = (examId) => api.post(`/exams/${examId}/start`);
export const saveAnswer = (attemptId, questionId, answer) =>
  api.put(`/exams/attempts/${attemptId}/answer`, { questionId, answer });
export const submitAttempt = (attemptId) => api.post(`/exams/attempts/${attemptId}/submit`);
