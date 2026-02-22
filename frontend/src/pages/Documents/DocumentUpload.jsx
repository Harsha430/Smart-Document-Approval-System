import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { documentsAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

const DocumentUpload = () => {
  const { t } = useTranslation('common')
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const uploadMutation = useMutation(
    documentsAPI.uploadDocument,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('documents')
        queryClient.invalidateQueries('myDocuments')
        toast.success(t('documents.uploadSuccess', 'Document uploaded successfully!'))
        navigate('/documents')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || t('documents.uploadFailed', 'Failed to upload document'))
      }
    }
  )

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (selectedFile) => {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error(t('documents.invalidType', 'Please select a PDF, DOC, DOCX, or TXT file'))
      return
    }

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error(t('documents.fileTooLarge', 'File size must be less than 10MB'))
      return
    }

    setFile(selectedFile)
    
    // Auto-generate title from filename if not set
    if (!title) {
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, '')
      setTitle(fileName)
    }
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const removeFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!file || !title.trim()) {
      toast.error(t('documents.provideTitleAndFile', 'Please provide both a title and select a file'))
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title.trim())

    uploadMutation.mutate(formData)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.uploadDocument')}</h1>
          <p className="text-gray-600">{t('documents.uploadSubtitle', 'Submit a new document for review and approval')}</p>
        </div>
      </motion.div>

      {/* Upload Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              {t('documents.titleLabel', 'Document Title *')}
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder={t('documents.titlePlaceholder', 'Enter a descriptive title for your document')}
              required
            />
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('documents.fileLabel', 'Document File *')}
            </label>
            
            {!file ? (
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-primary-400 bg-primary-50' 
                    : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-primary-600" />
                  </div>
                  
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {t('documents.dropHere', 'Drop your file here, or')} <span className="text-primary-600">{t('documents.browse', 'browse')}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('documents.supportedTypes', 'Supports PDF, DOC, DOCX, TXT files up to 10MB')}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-gray-200 rounded-xl p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">{t('documents.reviewProcess', 'Review Process')}</h4>
                <p className="text-sm text-blue-700 mt-1">
                  {t('documents.reviewProcessDesc', "Your document will go through a 3-stage approval process: Officer → Manager → Admin. You'll receive email notifications at each stage.")}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/documents')}
              className="btn-secondary"
              disabled={uploadMutation.isLoading}
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              disabled={!file || !title.trim() || uploadMutation.isLoading}
              className="btn-primary min-w-[140px] flex items-center justify-center"
            >
              {uploadMutation.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {t('nav.uploadDocument')}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default DocumentUpload
