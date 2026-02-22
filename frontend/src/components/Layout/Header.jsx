import React, { useState } from 'react'
import { Menu, Bell, Search, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { Dropdown } from 'flowbite-react'
import { useTranslation } from 'react-i18next'

const Header = ({ onMenuClick }) => {
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const { t, i18n } = useTranslation('common')

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  return (
    <header className="bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-3 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search */}
          <div className="hidden md:block ml-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('actions.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-80 pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Language switcher */}
          <Dropdown
            label=""
            inline
            renderTrigger={() => (
              <button className="px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-sm font-medium">
                {i18n.language === 'ru' ? 'RU' : 'EN'}
              </button>
            )}
          >
            <Dropdown.Item onClick={() => changeLanguage('en')}>EN - {t('lang.english')}</Dropdown.Item>
            <Dropdown.Item onClick={() => changeLanguage('ru')}>RU - {t('lang.russian')}</Dropdown.Item>
          </Dropdown>
          {/* Notifications */}
          <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl relative transition-all duration-200">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-gradient-to-r from-red-400 to-rose-500 ring-2 ring-white shadow-sm"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <button className="flex items-center space-x-3 text-sm rounded-xl p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold text-blue-700">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-700">{user?.name}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{user?.role}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              )}
            >
              <Dropdown.Header>
                <span className="block text-sm font-semibold">{user?.name}</span>
                <span className="block text-sm text-gray-500 truncate">{user?.email}</span>
              </Dropdown.Header>
              <Dropdown.Item href="/profile">
                {t('nav.profileSettings')}
              </Dropdown.Item>
              <Dropdown.Item href="/documents">
                {t('nav.myDocuments')}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>
                {t('actions.signout')}
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
