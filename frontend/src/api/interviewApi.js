import api from './client.js';

export const generateQuestions = (payload) => api.post('/interviews/generate', payload);
export const submitInterview = (payload) => api.post('/interviews/evaluate', payload);
export const getHistory = () => api.get('/history');
export const getHistoryById = (id) => api.get(`/history/${id}`);
export const deleteHistory = (id) => api.delete(`/history/${id}`);
