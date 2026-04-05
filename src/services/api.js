import axios from 'axios'

// In development, Vite proxy forwards API calls to backend.
// In production, set VITE_API_BASE_URL to your backend domain.
const rawBaseURL = import.meta.env.VITE_API_BASE_URL || ''
const apiBaseURL = rawBaseURL.replace(/\/+$/, '')

if (import.meta.env.PROD && !apiBaseURL) {
  console.warn('VITE_API_BASE_URL is empty. Configure backend URL for production.')
}

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  
  getCurrentUser: () => api.get('/auth/me'),
  
  updatePreferences: (preferred_language) =>
    api.put('/auth/me', { preferred_language }),
}

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  
  getById: (id) => api.get(`/products/${id}`),
  
  create: (data) => api.post('/admin/products', data),
  
  update: (id, data) => api.put(`/admin/products/${id}`, data),
  
  delete: (id) => api.delete(`/admin/products/${id}`),
}

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  
  create: (data) => api.post('/admin/categories', data),
  
  update: (id, data) => api.put(`/admin/categories/${id}`, data),
  
  delete: (id) => api.delete(`/admin/categories/${id}`),
}

// Orders API
export const ordersAPI = {
  create: (data) => api.post('/orders', data),

  getAll: (params = {}) => api.get('/orders', { params }),

  getById: (id) => api.get(`/orders/${id}`),
}

// Payment API
export const paymentAPI = {
  getMethods: () => api.get('/payment-methods'),

  createPayment: (data) => api.post('/payments/create', data),
}

// Admin API
export const adminAPI = {
  getUsers: (params = {}) => api.get('/admin/users', { params }),

  banUser: (id) => api.post(`/admin/users/${id}/ban`),

  unbanUser: (id) => api.post(`/admin/users/${id}/unban`),

  getDiscounts: () => api.get('/admin/discounts'),

  createDiscount: (data) => api.post('/admin/discounts', data),

  deleteDiscount: (id) => api.delete(`/admin/discounts/${id}`),
}

export default api
