import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  Upload, 
  GitBranch, 
  Users, 
  User, 
  ClipboardList,
  LogOut,
  X
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, canReview, canManageUsers, canViewAuditLogs } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const handleLogout = () => {
    logout()
    toast.success(t('toast.loggedOut'))
    navigate('/login')
  }

  const menuItems = [
    {
      name: t('nav.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
      show: true
    },
    {
      name: t('nav.myDocuments'),
      href: '/documents',
      icon: FileText,
      show: true
    },
    {
      name: t('nav.uploadDocument'),
      href: '/documents/upload',
      icon: Upload,
      show: true
    },
    {
      name: t('nav.workflows'),
      href: '/workflows',
      icon: GitBranch,
      show: canReview()
    },
    {
      name: t('nav.users'),
      href: '/users',
      icon: Users,
      show: canManageUsers()
    },
    {
      name: t('nav.auditLogs'),
      href: '/audit-logs',
      icon: ClipboardList,
      show: canViewAuditLogs()
    },
    {
      name: t('nav.profile'),
      href: '/profile',
      icon: User,
      show: true
    }
  ]

  const visibleMenuItems = menuItems.filter(item => item.show)

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:fixed lg:inset-y-0 lg:z-50">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-xl overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {t('app.name')}
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">{t('app.tagline')}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {visibleMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                          isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                        }`} />
                        <span className="font-medium">{item.name}</span>
                      </>
                    )}
                  </NavLink>
                )
              })}
            </nav>

            {/* User info and logout */}
            <div className="flex-shrink-0 border-t border-gray-100 p-4 bg-gray-50/50">
              <div className="flex items-center mb-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-700">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="group flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all duration-200 border border-transparent hover:border-red-100"
              >
                <LogOut className="mr-3 h-5 w-5 flex-shrink-0 group-hover:text-red-600" />
                <span className="font-medium">{t('actions.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900">{t('app.name')}</h1>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>

          {/* Mobile user info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
              {t('actions.logout')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
