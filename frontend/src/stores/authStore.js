import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => {
        set({
          token,
          user,
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        })
        localStorage.removeItem('auth-storage')
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }))
      },

      hasRole: (role) => {
        const { user } = get()
        return user?.role === role
      },

      hasAnyRole: (roles) => {
        const { user } = get()
        return roles.includes(user?.role)
      },

      isAdmin: () => {
        const { user } = get()
        return user?.role === 'ADMIN'
      },

      isManager: () => {
        const { user } = get()
        return user?.role === 'MANAGER'
      },

      isOfficer: () => {
        const { user } = get()
        return user?.role === 'OFFICER'
      },

      canReview: () => {
        const { user } = get()
        return ['ADMIN', 'MANAGER', 'OFFICER'].includes(user?.role)
      },

      canManageUsers: () => {
        const { user } = get()
        return ['ADMIN'].includes(user?.role)
      },

      canViewAllDocuments: () => {
        const { user } = get()
        return ['ADMIN', 'MANAGER'].includes(user?.role)
      },

      canViewAuditLogs: () => {
        const { user } = get()
        return ['ADMIN', 'MANAGER'].includes(user?.role)
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
