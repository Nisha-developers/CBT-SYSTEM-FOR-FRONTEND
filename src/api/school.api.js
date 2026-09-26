import api from './axios';

export const checkSchoolExists = () => api.get('/school/exists');
export const setupSchool = (data) => api.post('/school/setup', data);
export const getSchool = () => api.get('/school');
export const updateSchool = (data) => api.put('/school', data);
export const deleteSchool = (confirm) => api.delete('/school', { data: { confirm } });

export const addClass = (data) => api.post('/settings/classes', data);
export const addArm = (data) => api.post('/settings/arms', data);
export const updateArm = (id, data) => api.put(`/settings/arms/${id}`, data);
export const deleteArm = (id) => api.delete(`/settings/arms/${id}`);
export const addSubject = (data) => api.post('/settings/subjects', data);
export const updateSubject = (id, data) => api.put(`/settings/subjects/${id}`, data);
export const deleteSubject = (id) => api.delete(`/settings/subjects/${id}`);
