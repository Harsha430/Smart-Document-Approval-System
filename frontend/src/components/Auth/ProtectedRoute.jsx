import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

const ProtectedRoute = ({ children, requiredRole = null, requiredRoles = null }) => {
  const { token, user, hasRole, hasAnyRole } = useAuthStore()

  // Check if user is authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />
  }

  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
