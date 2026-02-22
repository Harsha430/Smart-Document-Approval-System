import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const StatsCard = ({ title, value, icon: Icon, color, change, changeType }) => {
  const { t } = useTranslation('common')
  const colorClasses = {
    primary: {
      bg: 'bg-primary-50',
      icon: 'text-primary-600',
      border: 'border-primary-200'
    },
    success: {
      bg: 'bg-success-50',
      icon: 'text-success-600',
      border: 'border-success-200'
    },
    warning: {
      bg: 'bg-warning-50',
      icon: 'text-warning-600',
      border: 'border-warning-200'
    },
    danger: {
      bg: 'bg-danger-50',
      icon: 'text-danger-600',
      border: 'border-danger-200'
    }
  }

  const currentColor = colorClasses[color] || colorClasses.primary

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`card hover:shadow-lg transition-all duration-300 ${currentColor.border} border-l-4`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          
          {change && (
            <div className="flex items-center mt-2">
              {changeType === 'increase' ? (
                <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-danger-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                changeType === 'increase' ? 'text-success-600' : 'text-danger-600'
              }`}>
                {change}
              </span>
              <span className="text-sm text-gray-500 ml-1">{t('dashboard.vsLastMonth', 'vs last month')}</span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 ${currentColor.bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${currentColor.icon}`} />
        </div>
      </div>
    </motion.div>
  )
}

export default StatsCard
