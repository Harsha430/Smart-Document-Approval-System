import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './stores/authStore'

// Components
import Layout from './components/Layout/Layout'
import PublicLayout from './components/Layout/PublicLayout'
import ProtectedRoute from './components/Auth/ProtectedRoute'

// Pages
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import Documents from './pages/Documents/Documents'
import DocumentUpload from './pages/Documents/DocumentUpload'
import DocumentDetail from './pages/Documents/DocumentDetail'
import Workflows from './pages/Workflows/Workflows'
import Users from './pages/Users/Users'
import Profile from './pages/Profile/Profile'
import AuditLogs from './pages/AuditLogs/AuditLogs'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  const { token } = useAuthStore()

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route 
                path="/login" 
                element={!token ? <Login /> : <Navigate to="/dashboard" replace />} 
              />
              <Route 
                path="/register" 
                element={!token ? <Register /> : <Navigate to="/dashboard" replace />} 
              />
            </Route>
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="documents" element={<Documents />} />
              <Route path="documents/upload" element={<DocumentUpload />} />
              <Route path="documents/:id" element={<DocumentDetail />} />
              <Route path="workflows" element={<Workflows />} />
              <Route path="users" element={<Users />} />
              <Route path="profile" element={<Profile />} />
              <Route path="audit-logs" element={<AuditLogs />} />
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
