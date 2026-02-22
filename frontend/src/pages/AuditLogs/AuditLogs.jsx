import React from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, Activity } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const AuditLogs = () => {
  const { t } = useTranslation('common')
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('audit.title', 'Audit Logs 📊')}
            </h1>
            <p className="text-primary-100 text-lg">
              {t('audit.subtitle', 'Track system activities and user actions')}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <Activity className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card text-center py-12"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('audit.title', 'Audit Logs')}</h3>
        <p className="text-gray-600">{t('common.comingSoon', 'Functionality coming soon...')}</p>
      </motion.div>
    </div>
  )
}

export default AuditLogs
