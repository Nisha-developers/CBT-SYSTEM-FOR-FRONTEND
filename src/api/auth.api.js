import api, { bareApi } from './axios';

export const adminSignup = (data) => api.post('/auth/admin/signup', data);
export const adminLogin = (data) => api.post('/auth/admin/login', data);
export const studentLogin = (data) => api.post('/auth/student/login', data);
export const changeStudentPassword = (data) => api.post('/auth/student/change-password', data);
export const getMe = () => api.get('/auth/me');

// Cookie-based session calls (they use the interceptor-free client so they can't loop)
export const refreshSession = () => bareApi.post('/auth/refresh');
export const logoutRequest = () => bareApi.post('/auth/logout');
export const logoutEverywhere = () => api.post('/auth/logout-all');

// Super-admin: manage other admins (ids are uids)
export const listAdmins = () => api.get('/admins');
export const createAdmin = (data) => api.post('/admins', data);
export const updateAdmin = (uid, data) => api.put(`/admins/${uid}`, data);
export const deleteAdmin = (uid) => api.delete(`/admins/${uid}`);
