import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Download,
  Eye,
  Trash2,
  Calendar,
  User,
  MoreVertical
} from 'lucide-react'
import { useQuery, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { documentsAPI } from '../../services/api'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../stores/authStore'
import { format } from 'date-fns'
import DocumentCard from '../../components/Documents/DocumentCard'
import DocumentTable from '../../components/Documents/DocumentTable'

const Documents = () => {
  const { t } = useTranslation('common')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'table'
  const { canViewAllDocuments } = useAuthStore()
  const queryClient = useQueryClient()

  // Fetch documents
  const { data: documents = [], isLoading, error } = useQuery(
    'documents',
    canViewAllDocuments() ? documentsAPI.getAllDocuments : documentsAPI.getMyDocuments,
    {
      select: (response) => response.data,
      onError: (error) => console.error('Error fetching documents:', error)
    }
  )

  const handleDelete = (documentId) => {
    // Refresh the documents list after deletion
    queryClient.invalidateQueries('documents')
  }

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    ALL: documents.length,
    PENDING: documents.filter(doc => doc.status === 'PENDING').length,
    APPROVED: documents.filter(doc => doc.status === 'APPROVED').length,
    REJECTED: documents.filter(doc => doc.status === 'REJECTED').length
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {canViewAllDocuments() ? t('documents.all', 'All Documents') : t('nav.myDocuments')}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              {canViewAllDocuments()
                ? t('documents.manageAll', 'Manage and review all system documents')
                : t('documents.viewAndManage', 'View and manage your uploaded documents')
              }
            </p>
          </div>

          <div className="mt-6 sm:mt-0">
            <Link
              to="/documents/upload"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('nav.uploadDocument')}
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {Object.entries(statusCounts).map(([status, count]) => (
          <motion.div
            key={status}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`bg-white rounded-2xl shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-xl p-6 ${
              statusFilter === status
                ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
                : 'border-gray-100 hover:border-gray-200'
            }`}
            onClick={() => setStatusFilter(status)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {status === 'ALL' 
                    ? t('common.total', 'Total') 
                    : status === 'PENDING' 
                      ? t('status.pending', 'Pending') 
                      : status === 'APPROVED' 
                        ? t('status.approved', 'Approved') 
                        : t('status.rejected', 'Rejected')}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{count}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                status === 'PENDING' ? 'bg-gradient-to-br from-yellow-100 to-amber-100 text-yellow-600' :
                status === 'APPROVED' ? 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-600' :
                status === 'REJECTED' ? 'bg-gradient-to-br from-red-100 to-rose-100 text-red-600' :
                'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600'
              }`}>
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('actions.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'table' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="w-4 h-4 flex flex-col space-y-0.5">
                <div className="h-0.5 bg-current rounded"></div>
                <div className="h-0.5 bg-current rounded"></div>
                <div className="h-0.5 bg-current rounded"></div>
                <div className="h-0.5 bg-current rounded"></div>
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Documents Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredDocuments.map((document, index) => (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
              >
                <DocumentCard document={document} onDelete={handleDelete} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <DocumentTable documents={filteredDocuments} />
          </div>
        )}
      </motion.div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || statusFilter !== 'ALL' ? t('documents.notFound', 'No documents found') : t('documents.noneYet', 'No documents yet')}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || statusFilter !== 'ALL' 
              ? t('documents.adjustSearch', 'Try adjusting your search or filter criteria')
              : t('documents.startByUploading', 'Start by uploading your first document')
            }
          </p>
          {!searchQuery && statusFilter === 'ALL' && (
            <Link
              to="/documents/upload"
              className="btn-primary inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('nav.uploadDocument')}
            </Link>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default Documents
