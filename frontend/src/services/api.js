import axios from 'axios'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error
    
    if (response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    } else if (response?.status === 403) {
      toast.error('You do not have permission to perform this action.')
    } else if (response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (response?.data?.message) {
      toast.error(response.data.message)
    } else {
      toast.error('An unexpected error occurred.')
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
}

// Documents API
export const documentsAPI = {
  getMyDocuments: () => api.get('/documents/my'),
  getAllDocuments: () => api.get('/documents/all'),
  getDocument: (id) => api.get(`/documents/${id}`),
  uploadDocument: (formData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  downloadDocument: (id) => api.get(`/documents/${id}/download`, {
    responseType: 'blob'
  }),
  deleteDocument: (id) => api.delete(`/documents/${id}`),
}

// Workflows API
export const workflowsAPI = {
  getPendingWorkflows: () => api.get('/workflows/pending'),
  getDocumentWorkflows: (documentId) => api.get(`/workflows/document/${documentId}`),
  processWorkflowAction: (actionData) => api.post('/workflows/action', actionData),
}

// Users API
export const usersAPI = {
  getAllUsers: () => api.get('/users/all'),
  getUserProfile: () => api.get('/users/profile'),
  getUsersByRole: (role) => api.get(`/users/role/${role}`),
  updateUserRole: (userId, role) => api.put(`/users/${userId}/role`, null, {
    params: { role }
  }),
  getUser: (userId) => api.get(`/users/${userId}`),
}

// Audit Logs API
export const auditAPI = {
  getAllAuditLogs: () => api.get('/audit/all'),
  getMyAuditLogs: () => api.get('/audit/my'),
  getUserAuditLogs: (userEmail) => api.get(`/audit/user/${userEmail}`),
  getDocumentAuditLogs: (documentId) => api.get(`/audit/document/${documentId}`),
  getAuditLogsByDateRange: (start, end) => api.get('/audit/date-range', {
    params: { start, end }
  }),
}

export default api
