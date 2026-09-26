import api from './axios';

export const adminSignup = (data) => api.post('/auth/admin/signup', data);
export const adminLogin = (data) => api.post('/auth/admin/login', data);
export const studentLogin = (data) => api.post('/auth/student/login', data);
