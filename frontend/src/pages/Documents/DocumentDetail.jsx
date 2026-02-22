import React from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Download, Calendar, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const DocumentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  // This would normally fetch document details from API
  const document = {
    id,
    title: 'Sample Document',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    uploadedBy: 'John Doe'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-4"
      >
        <button
          onClick={() => navigate('/documents')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('documents.detailsTitle', 'Document Details')}</h1>
          <p className="text-gray-600">{t('documents.detailsSubtitle', 'View document information and status')}</p>
        </div>
      </motion.div>

      {/* Document Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{document.title}</h2>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {document.uploadedBy}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(document.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
          <button className="btn-primary flex items-center">
            <Download className="w-4 h-4 mr-2" />
            {t('documents.download', 'Download')}
          </button>
        </div>

        <div className="text-center py-12 text-gray-500">
          {t('documents.detailsComingSoon', 'Document details implementation in progress...')}
        </div>
      </motion.div>
    </div>
  )
}

export default DocumentDetail
