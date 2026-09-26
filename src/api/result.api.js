import api from './axios';

export const viewResults = (params) => api.get('/results', { params });
export const recordTheoryMarks = (data) => api.post('/results/theory', data);
export const releaseResult = (id) => api.put(`/results/${id}/release`);
export const releaseBatch = (resultIds) => api.put('/results/release-batch', { resultIds });
export const pastResults = (params) => api.get('/results/past', { params });
export const myResults = () => api.get('/results/mine');
