import axios from 'axios';

// Base URL can be configured via environment variables, defaulting to localhost:3000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const loginAPI = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data; // Expected { success: true, message, data: { token, user } }
};

export const registerAPI = async (firstName, lastName, email, password) => {
  const response = await api.post('/auth/register', { firstName, lastName, email, password });
  return response.data;
};

// Wristband endpoints
export const assignWristbandAPI = async (uid) => {
  const response = await api.post('/wristband/assign', { uid });
  return response.data;
};

export const getWristbandAPI = async (userId) => {
  const response = await api.get(`/wristband/${userId}`);
  return response.data;
};

// Running session endpoints
export const getSessionsAPI = async (userId) => {
  const response = await api.get(`/sessions/${userId}`);
  return response.data;
};

export const getSessionLapsAPI = async (sessionId) => {
  const response = await api.get(`/sessions/${sessionId}/laps`);
  return response.data;
};

export default api;
