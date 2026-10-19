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

export const importQuestions = (examId, file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post(`/exams/${examId}/questions/import`, form);
};
export const confirmImportedQuestions = (examId, questions) =>
  api.post(`/exams/${examId}/questions/import/confirm`, { questions });

// ---- Student ----
export const availableExams = (data) => api.get(`/exams/available/${encodeURIComponent(data)}`);
export const startAttempt = (examId, data) => api.post(`/exams/${examId}/start/${encodeURIComponent(data.studentId)}`, data);
export const getExam = (examId, studentId) => api.get(`/exams/${examId}/${encodeURIComponent(studentId)}`);
export const saveAnswer = (attemptId, questionId, answer) =>
  api.put(`/exams/attempts/${attemptId}/answer`, { questionId, answer });
export const submitAttempt = (attemptId) => api.post(`/exams/attempts/${attemptId}/submit`);
