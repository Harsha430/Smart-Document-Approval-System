import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  FileText, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  User,
  Calendar,
  Loader2
} from 'lucide-react'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

const ReviewModal = ({ workflow, onSubmit, onClose, isLoading }) => {
  const { t } = useTranslation('common')
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState(workflow.action || 'APPROVED')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      status,
      comment: comment.trim()
    })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {t('workflows.reviewDocument', 'Review Document')}
                    </h3>
                    <p className="text-primary-100 text-sm">
                      {workflow.documentTitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
              {/* Document Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>{t('documents.uploadedBy', 'Uploaded by')} {workflow.uploaderName || t('common.unknown', 'Unknown')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {workflow.createdAt ? 
                        format(new Date(workflow.createdAt), 'MMM dd, yyyy HH:mm') : 
                        t('common.unknownDate', 'Unknown date')
                      }
                    </span>
                  </div>
                </div>
                
                {workflow.comment && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-700">{workflow.comment}</p>
                        <p className="text-xs text-gray-500 mt-1">Previous comment</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Review Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Action Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Review Decision
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStatus('APPROVED')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        status === 'APPROVED'
                          ? 'border-success-300 bg-success-50 text-success-700'
                          : 'border-gray-200 hover:border-success-200 text-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">{t('actions.approve', 'Approve')}</span>
                      </div>
                      <p className="text-xs mt-1 opacity-75">
                        {t('workflows.meetsRequirements', 'Document meets requirements')}
                      </p>
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStatus('REJECTED')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        status === 'REJECTED'
                          ? 'border-danger-300 bg-danger-50 text-danger-700'
                          : 'border-gray-200 hover:border-danger-200 text-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <XCircle className="w-5 h-5" />
                        <span className="font-medium">{t('actions.reject', 'Reject')}</span>
                      </div>
                      <p className="text-xs mt-1 opacity-75">
                        {t('workflows.needsRevision', 'Document needs revision')}
                      </p>
                    </motion.button>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('workflows.reviewComment', 'Review Comment')} {status === 'REJECTED' && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input-field resize-none"
                    placeholder={
                      status === 'APPROVED' 
                        ? t('workflows.approvePlaceholder', 'Add any additional notes (optional)...')
                        : t('workflows.rejectPlaceholder', 'Please explain why this document is being rejected...')
                    }
                    required={status === 'REJECTED'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {status === 'REJECTED' 
                      ? t('workflows.commentRequired', 'A comment is required when rejecting a document')
                      : t('workflows.commentOptional', 'Optional: Add any feedback or notes')
                    }
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || (status === 'REJECTED' && !comment.trim())}
                    className={`${
                      status === 'APPROVED' ? 'btn-success' : 'btn-danger'
                    } min-w-[120px] flex items-center justify-center`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {status === 'APPROVED' ? (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-2" />
                        )}
                        {status === 'APPROVED' ? t('actions.approve', 'Approve') : t('actions.reject', 'Reject')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default ReviewModal
