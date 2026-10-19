import api from './axios';

export const listStudents = (params) => api.get('/students', { params });
export const addStudent = (data) => api.post('/students', data);
export const getStudent = (uid) => api.get(`/students/${uid}`);
export const updateStudent = (uid, data) => api.put(`/students/${uid}`, data);
export const deleteStudent = (uid) => api.delete(`/students/${uid}`);
export const resetStudentPassword = (uid) => api.post(`/students/${uid}/reset-password`);
