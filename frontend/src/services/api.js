/**
 * API Service - Axios Configuration
 *
 * TEACHING NOTE:
 * Instead of writing the full URL in every request, we create an Axios instance
 * with a baseURL. This is the DRY (Don't Repeat Yourself) principle.
 *
 * Interceptors let us:
 * - Request interceptor: Automatically attach the JWT token to every request
 * - Response interceptor: Handle 401 errors globally (token expired)
 */

import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================
// REQUEST INTERCEPTOR
// ========================

/**
 * TEACHING NOTE: Request Interceptor
 * This runs BEFORE every API request is sent.
 * We read the token from localStorage and add it to the Authorization header.
 * This way, we never have to manually add the token in components.
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========================
// RESPONSE INTERCEPTOR
// ========================

/**
 * TEACHING NOTE: Response Interceptor
 * This runs AFTER every API response comes back.
 * If we get a 401 (Unauthorized), the token is expired/invalid.
 * We clear storage and redirect to login.
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      const isLoginPage = window.location.pathname === '/login';
      if (!isLoginPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ========================
// AUTH API
// ========================
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  forgotPassword: (email) => API.post('/auth/forgotpassword', { email }),
  resetPassword: (token, password) => API.put(`/auth/resetpassword/${token}`, { password }),
  changePassword: (data) => API.put('/auth/changepassword', data),
};

// ========================
// POSTS API
// ========================
export const postsAPI = {
  getAll: (params) => API.get('/posts', { params }),
  getOne: (slug) => API.get(`/posts/${slug}`),
  getFeatured: () => API.get('/posts/featured'),
  getMyPosts: (params) => API.get('/posts/my-posts', { params }),
  create: (data) => API.post('/posts', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => API.put(`/posts/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/posts/${id}`),
  toggleLike: (id) => API.post(`/posts/${id}/like`),
};

// ========================
// CATEGORIES API
// ========================
export const categoriesAPI = {
  getAll: () => API.get('/categories'),
  getOne: (slug, params) => API.get(`/categories/${slug}`, { params }),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

// ========================
// COMMENTS API
// ========================
export const commentsAPI = {
  getForPost: (postId) => API.get(`/comments/${postId}`),
  add: (postId, data) => API.post(`/comments/${postId}`, data),
  update: (id, data) => API.put(`/comments/${id}`, data),
  delete: (id) => API.delete(`/comments/${id}`),
};

// ========================
// USERS API
// ========================
export const usersAPI = {
  getProfile: (username) => API.get(`/users/${username}`),
  updateProfile: (data) => API.put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getDashboard: () => API.get('/users/dashboard'),
};

// ========================
// ADMIN API
// ========================
export const adminAPI = {
  getAnalytics: () => API.get('/admin/analytics'),
  getUsers: (params) => API.get('/admin/users', { params }),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  toggleUserStatus: (id) => API.patch(`/admin/users/${id}/toggle-status`),
  getPosts: (params) => API.get('/admin/posts', { params }),
};

export default API;
