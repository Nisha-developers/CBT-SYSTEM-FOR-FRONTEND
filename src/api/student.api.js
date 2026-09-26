import api from './axios';

export const listStudents = (params) => api.get('/students', { params });
export const addStudent = (data) => api.post('/students', data);
export const getStudent = (id) => api.get(`/students/${id}`);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);
