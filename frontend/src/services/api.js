import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for attaching auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('buyora_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor for handling 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      if (localStorage.getItem('buyora_token')) {
        localStorage.removeItem('buyora_token');
        localStorage.removeItem('buyora_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updatePreferences: (weights) => api.put('/auth/preferences', weights),
};

export const productsApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  compareUpgrade: (data) => api.post('/products/upgrade-compare', data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const compareApi = {
  compare: (data) => api.post('/compare', data),
};

export const aiApi = {
  extract: (data) => api.post('/ai/extract', data),
  chat: (data) => api.post('/ai/chat', data),
  recommendByBudget: (data) => api.post('/ai/recommend', data),
};

export const pricesApi = {
  getHistory: (productId) => api.get(`/prices/${productId}`),
  createAlert: (data) => api.post('/prices/alerts', data),
  getUserAlerts: () => api.get('/prices/alerts/user'),
  deleteAlert: (id) => api.delete(`/prices/alerts/${id}`),
};

export const reviewsApi = {
  getReviews: (productId) => api.get(`/reviews/${productId}`),
  addReview: (data) => api.post('/reviews', data),
};

export const savedApi = {
  getSaved: () => api.get('/saved'),
  toggleSave: (productId) => api.post('/saved/toggle', { productId }),
};

export const uploadApi = {
  uploadFile: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default api;
