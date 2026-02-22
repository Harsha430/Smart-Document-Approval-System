import React from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Users,
  Upload,
  Eye
} from 'lucide-react'
import { useQuery } from 'react-query'
import { documentsAPI, workflowsAPI } from '../../services/api'
import { useAuthStore } from '../../stores/authStore'
import StatsCard from '../../components/Dashboard/StatsCard'
import { useTranslation } from 'react-i18next'
import RecentDocuments from '../../components/Dashboard/RecentDocuments'
import WorkflowProgress from '../../components/Dashboard/WorkflowProgress'
import QuickActions from '../../components/Dashboard/QuickActions'

const Dashboard = () => {
  const { t } = useTranslation('common')
  const { user, canReview, canViewAllDocuments } = useAuthStore()

  // Fetch user's documents
  const { data: myDocuments = [] } = useQuery(
    'myDocuments',
    documentsAPI.getMyDocuments,
    {
      select: (response) => response.data,
      onError: (error) => console.error('Error fetching documents:', error)
    }
  )

  // Fetch pending workflows if user can review
  const { data: pendingWorkflows = [] } = useQuery(
    'pendingWorkflows',
    workflowsAPI.getPendingWorkflows,
    {
      enabled: canReview(),
      select: (response) => response.data,
      onError: (error) => console.error('Error fetching workflows:', error)
    }
  )

  // Calculate stats
  const totalDocuments = myDocuments.length
  const pendingDocuments = myDocuments.filter(doc => doc.status === 'PENDING').length
  const approvedDocuments = myDocuments.filter(doc => doc.status === 'APPROVED').length
  const rejectedDocuments = myDocuments.filter(doc => doc.status === 'REJECTED').length

  const stats = [
    {
      title: t('dashboard.totalDocuments', 'Total Documents'),
      value: totalDocuments,
      icon: FileText,
      color: 'primary',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: t('dashboard.pendingReview', 'Pending Review'),
      value: pendingDocuments,
      icon: Clock,
      color: 'warning',
      change: '-5%',
      changeType: 'decrease'
    },
    {
      title: t('dashboard.approved', 'Approved'),
      value: approvedDocuments,
      icon: CheckCircle,
      color: 'success',
      change: '+18%',
      changeType: 'increase'
    },
    {
      title: t('dashboard.rejected', 'Rejected'),
      value: rejectedDocuments,
      icon: XCircle,
      color: 'danger',
      change: '-2%',
      changeType: 'decrease'
    }
  ]

  // Add reviewer-specific stats
  if (canReview()) {
    stats.push({
      title: t('dashboard.pendingReviews', 'Pending Reviews'),
      value: pendingWorkflows.length,
      icon: Users,
      color: 'primary',
      change: '+8%',
      changeType: 'increase'
    })
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('dashboard.welcomeBack', 'Welcome back')}, {user?.name}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
              {t('dashboard.subtitle', "Here's what's happening with your documents today.")}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <RecentDocuments documents={myDocuments.slice(0, 5)} />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <QuickActions />
        </motion.div>
      </div>

      {/* Workflow Progress - Only show for reviewers */}
      {canReview() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <WorkflowProgress
            workflows={pendingWorkflows}
            documents={myDocuments.slice(0, 5)}
          />
        </motion.div>
      )}

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.recentActivity', 'Recent Activity')}</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            {t('common.viewAll', 'View All')}
          </button>
        </div>
        
        <div className="space-y-4">
          {myDocuments.slice(0, 3).map((doc, index) => (
            <div key={doc.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                doc.status === 'APPROVED' ? 'bg-success-100 text-success-600' :
                doc.status === 'REJECTED' ? 'bg-danger-100 text-danger-600' :
                'bg-warning-100 text-warning-600'
              }`}>
                {doc.status === 'APPROVED' ? <CheckCircle className="w-5 h-5" /> :
                 doc.status === 'REJECTED' ? <XCircle className="w-5 h-5" /> :
                 <Clock className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                <p className="text-xs text-gray-500">
                  {doc.status === 'APPROVED' ? t('status.documentApproved', 'Document approved') :
                   doc.status === 'REJECTED' ? t('status.documentRejected', 'Document rejected') :
                   t('status.waitingForReview', 'Waiting for review')}
                </p>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(doc.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
