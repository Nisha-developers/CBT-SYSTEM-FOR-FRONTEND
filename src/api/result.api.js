import api from './axios';

// ---- Admin ----
export const viewResults = (params) => api.get('/results', { params });
export const releaseResults = (data) => api.put('/results/release', data);
export const theorySheet = (examId) => api.get('/results/theory/sheet', { params: { examId } });
export const theoryAnswers = (examId, studentId) =>
  api.get('/results/theory/answers', { params: { examId, studentId } });
export const recordTheoryMarks = (data) => api.post('/results/theory', data);
export const pastResults = (studentId) => api.get('/results/past', { params: { studentId } });
export const getReview = (params) => api.get('/results/review', { params });
export const saveReview = (data) => api.post('/results/review', data);

// ---- Student ----
export const myResults = () => api.get('/results/mine');
