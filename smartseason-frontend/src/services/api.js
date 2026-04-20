import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios instance with config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to all requests
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

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - Token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTICATION API
// ============================================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// ============================================
// FIELDS API
// ============================================
export const fieldsAPI = {
  getAll: () => api.get('/fields'),
  create: (data) => api.post('/fields', data),
  update: (id, data) => api.put(`/fields/${id}`, data),
  assign: (id, data) => api.put(`/fields/${id}/assign`, data),
  delete: (id) => api.delete(`/fields/${id}`),
};

// ============================================
// UPDATES API
// ============================================
export const updatesAPI = {
  create: (data) => api.post('/updates', data),
  getFieldUpdates: (fieldId) => api.get(`/updates/field/${fieldId}`),
  getAgentUpdates: () => api.get('/updates/agent/my-updates'),
};

export default api;
