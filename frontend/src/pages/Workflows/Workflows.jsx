import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  GitBranch,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Calendar,
  MessageSquare,
  Filter,
  Search,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { workflowsAPI } from "../../services/api";
import { useAuthStore } from "../../stores/authStore";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import WorkflowCard from "../../components/Workflows/WorkflowCard";
import ReviewModal from "../../components/Workflows/ReviewModal";

const Workflows = () => {
  const { t } = useTranslation("common");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch pending workflows
  const { data: workflows = [], isLoading } = useQuery(
    "pendingWorkflows",
    workflowsAPI.getPendingWorkflows,
    {
      select: (response) => response.data,
      onError: (error) => console.error("Error fetching workflows:", error),
    }
  );

  // Process workflow action mutation
  const processWorkflowMutation = useMutation(
    workflowsAPI.processWorkflowAction,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("pendingWorkflows");
        queryClient.invalidateQueries("documents");
        queryClient.invalidateQueries("myDocuments");
        toast.success("Workflow action processed successfully");
        setShowReviewModal(false);
        setSelectedWorkflow(null);
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to process workflow action"
        );
      },
    }
  );

  // Filter workflows
  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch = workflow.documentTitle
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReviewAction = (workflow, action) => {
    setSelectedWorkflow({ ...workflow, action });
    setShowReviewModal(true);
  };

  const handleSubmitReview = (reviewData) => {
    processWorkflowMutation.mutate({
      workflowId: selectedWorkflow.id,
      status: reviewData.status,
      comment: reviewData.comment,
    });
  };

  const statusCounts = {
    ALL: workflows.length,
    PENDING: workflows.filter((w) => w.status === "PENDING").length,
    APPROVED: workflows.filter((w) => w.status === "APPROVED").length,
    REJECTED: workflows.filter((w) => w.status === "REJECTED").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
              {t("workflows.title", "Document Workflows 📋")}
            </h1>
            <p className="text-primary-100 text-lg">
              {t(
                "workflows.subtitle",
                "Review and manage document approval workflows"
              )}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <GitBranch className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
              statusFilter === status
                ? "ring-2 ring-primary-500 bg-primary-50"
                : ""
            }`}
            onClick={() => setStatusFilter(status)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {status === "ALL"
                    ? t("common.total", "Total")
                    : status === "PENDING"
                    ? t("status.pending", "Pending")
                    : status === "APPROVED"
                    ? t("status.approved", "Approved")
                    : t("status.rejected", "Rejected")}
                </p>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
              </div>
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  status === "PENDING"
                    ? "bg-warning-100 text-warning-600"
                    : status === "APPROVED"
                    ? "bg-success-100 text-success-600"
                    : status === "REJECTED"
                    ? "bg-danger-100 text-danger-600"
                    : "bg-primary-100 text-primary-600"
                }`}
              >
                {status === "PENDING" ? (
                  <Clock className="w-5 h-5" />
                ) : status === "APPROVED" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : status === "REJECTED" ? (
                  <XCircle className="w-5 h-5" />
                ) : (
                  <GitBranch className="w-5 h-5" />
                )}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t(
                "workflows.searchPlaceholder",
                "Search workflows..."
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {t("workflows.showingXofY", "Showing")} {filteredWorkflows.length}{" "}
              {t("workflows.of", "of")} {workflows.length}{" "}
              {t("workflows.workflows", "workflows")}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Workflows Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredWorkflows.map((workflow, index) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <WorkflowCard
              workflow={workflow}
              onReviewAction={handleReviewAction}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredWorkflows.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <GitBranch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || statusFilter !== "PENDING"
              ? t("workflows.noneFound", "No workflows found")
              : t("workflows.nonePending", "No pending workflows")}
          </h3>
          <p className="text-gray-600">
            {searchQuery || statusFilter !== "PENDING"
              ? t(
                  "common.adjustSearch",
                  "Try adjusting your search or filter criteria"
                )
              : t(
                  "workflows.allProcessed",
                  "All workflows have been processed"
                )}
          </p>
        </motion.div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedWorkflow && (
        <ReviewModal
          workflow={selectedWorkflow}
          onSubmit={handleSubmitReview}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedWorkflow(null);
          }}
          isLoading={processWorkflowMutation.isLoading}
        />
      )}
    </div>
  );
};

export default Workflows;
