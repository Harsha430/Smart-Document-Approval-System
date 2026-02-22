import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FileText,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  MessageSquare,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import api from "../../services/api";

const WorkflowCard = ({ workflow, onReviewAction }) => {
  const { t } = useTranslation("common");
  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-danger-600" />;
      default:
        return <Clock className="w-5 h-5 text-warning-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-success-100 text-success-800 border-success-200";
      case "REJECTED":
        return "bg-danger-100 text-danger-800 border-danger-200";
      default:
        return "bg-warning-100 text-warning-800 border-warning-200";
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case "APPROVED":
        return 100;
      case "REJECTED":
        return 100;
      case "PENDING":
        return 33;
      default:
        return 0;
    }
  };

  const handleViewDocument = async (document) => {
    if (document && document.id) {
      try {
        // Use the API instance to get the document with authentication
        const response = await api.get(`/documents/${document.id}/download`, {
          responseType: "blob",
        });

        // Create a blob URL and open it in a new tab
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");

        // Clean up the blob URL after a short delay
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      } catch (error) {
        console.error("Error viewing document:", error);
        if (error.response?.status === 403) {
          alert("You do not have permission to view this document.");
        } else if (error.response?.status === 404) {
          alert("Document not found.");
        } else {
          alert("Failed to view document. Please try again.");
        }
      }
    } else {
      alert("Document not available for viewing");
    }
  };

  const reviewStages = [
    { name: "Officer", role: "OFFICER", step: 1 },
    { name: "Manager", role: "MANAGER", step: 2 },
    { name: "Admin", role: "ADMIN", step: 3 },
  ];

  const currentStep =
    workflow.status === "PENDING"
      ? 1
      : workflow.status === "APPROVED"
      ? 3
      : workflow.status === "REJECTED"
      ? 1
      : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden"
    >
      {/* Status Bar */}
      <div
        className={`h-1 w-full ${
          workflow.status === "APPROVED"
            ? "bg-gradient-to-r from-green-400 to-emerald-500"
            : workflow.status === "REJECTED"
            ? "bg-gradient-to-r from-red-400 to-rose-500"
            : "bg-gradient-to-r from-blue-400 to-indigo-500"
        }`}
      />

      {/* Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                workflow.status === "APPROVED"
                  ? "bg-green-50"
                  : workflow.status === "REJECTED"
                  ? "bg-red-50"
                  : "bg-blue-50"
              }`}
            >
              <FileText
                className={`w-6 h-6 ${
                  workflow.status === "APPROVED"
                    ? "text-green-600"
                    : workflow.status === "REJECTED"
                    ? "text-red-600"
                    : "text-blue-600"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                <span className="block truncate" title={workflow.documentTitle}>
                  {workflow.documentTitle}
                </span>
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {t("workflows.workflowId", "Workflow ID")}: {workflow.id}
              </p>
            </div>
          </div>

          <div
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(
              workflow.status
            )}`}
          >
            {t(`status.${workflow.status}`, workflow.status)}
          </div>
        </div>

        {/* Document Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <User className="w-4 h-4 mr-3 text-gray-400" />
            <span className="font-medium">
              By {workflow.uploaderName || "Unknown"}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <Calendar className="w-4 h-4 mr-3 text-gray-400" />
            <span className="font-medium">
              {workflow.createdAt
                ? format(new Date(workflow.createdAt), "MMM dd, yyyy")
                : "Unknown date"}
            </span>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-blue-700">
              {t("workflows.reviewProgress", "Review Progress")}
            </h4>
            <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              {t("workflows.stepOf", "Step {{current}} of {{total}}", {
                current: currentStep,
                total: reviewStages.length,
              })}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-blue-100 rounded-full h-3 mb-4 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage(workflow.status)}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`h-3 rounded-full shadow-sm ${
                workflow.status === "APPROVED"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : workflow.status === "REJECTED"
                  ? "bg-gradient-to-r from-red-500 to-rose-600"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600"
              }`}
            />
          </div>

          {/* Review Stages */}
          <div className="flex items-center justify-between">
            {reviewStages.map((stage, index) => (
              <React.Fragment key={stage.role}>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{
                      scale: index + 1 <= currentStep ? 1 : 0.8,
                      opacity: index + 1 <= currentStep ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      index + 1 < currentStep
                        ? "bg-success-100 border-success-300 text-success-700"
                        : index + 1 === currentStep
                        ? "bg-primary-100 border-primary-300 text-primary-700"
                        : "bg-gray-100 border-gray-300 text-gray-500"
                    }`}
                  >
                    {index + 1 < currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : index + 1 === currentStep ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </motion.div>
                  <span className="text-xs text-gray-600 mt-1 text-center">
                    {stage.role === "officer"
                      ? t("roles.officer", "Officer")
                      : stage.role === "manager"
                      ? t("roles.manager", "Manager")
                      : stage.role === "admin"
                      ? t("roles.admin", "Admin")
                      : stage.name}
                  </span>
                </div>
                {index < reviewStages.length - 1 && (
                  <div className="flex-1 mx-2">
                    <div
                      className={`h-0.5 ${
                        index + 1 < currentStep
                          ? "bg-success-300"
                          : index + 1 === currentStep
                          ? "bg-primary-300"
                          : "bg-gray-300"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Comment Section */}
        {workflow.comment && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700">{workflow.comment}</p>
                {workflow.reviewedAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Reviewed{" "}
                    {format(
                      new Date(workflow.reviewedAt),
                      "MMM dd, yyyy HH:mm"
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={() => handleViewDocument(workflow.document)}
            className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-200"
          >
            <Eye className="w-4 h-4 mr-1" />
            {t("documents.view", "View Document")}
          </button>

          {workflow.status === "PENDING" && (
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onReviewAction(workflow, "REJECTED")}
                className="btn-danger text-sm px-4 py-2"
              >
                {t("actions.reject", "Reject")}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onReviewAction(workflow, "APPROVED")}
                className="btn-success text-sm px-4 py-2"
              >
                {t("actions.approve", "Approve")}
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Workflow Status Indicator */}
      <motion.div
        className={`absolute top-0 right-0 w-3 h-3 rounded-full ${
          workflow.status === "APPROVED"
            ? "bg-success-500"
            : workflow.status === "REJECTED"
            ? "bg-danger-500"
            : "bg-warning-500"
        }`}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

export default WorkflowCard;
