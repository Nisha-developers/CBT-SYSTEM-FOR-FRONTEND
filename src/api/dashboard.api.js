import api from './axios';

export const getOverview = () => api.get('/dashboard/overview');
export const listActivities = (params) => api.get('/activities', { params });
