import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  User,
  FileText,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

const WorkflowProgress = ({ workflows, documents }) => {
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

  const getProgressPercentage = (document) => {
    // Use the progressPercentage from the backend if available
    if (document.progressPercentage !== undefined) {
      return document.progressPercentage;
    }

    // Fallback calculation
    if (document.status === "APPROVED") return 100;
    if (document.status === "REJECTED") return 100;
    if (document.status === "PENDING") return 33;

    return 0;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {t("documents.progress", "Document Progress")}
          </h3>
          <p className="text-sm text-gray-600">
            {t(
              "documents.recentStatuses",
              "Recent documents and their approval status"
            )}
          </p>
        </div>
        <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
          {workflows.length} {t("workflows.pendingReviews", "pending reviews")}
        </div>
      </div>

      <div className="space-y-6">
        {documents &&
          documents.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300"
            >
              {/* Document Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {document.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t("documents.uploadedBy", "Uploaded by")}{" "}
                      {document.uploadedBy || t("common.unknown", "Unknown")}
                    </p>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    document.status
                  )}`}
                >
                  {t(`status.${document.status}`, document.status)}
                </div>
              </div>

              {/* Document Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {t("documents.approvalProgress", "Approval Progress")}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getProgressPercentage(document)}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage(document)}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className={`h-2 rounded-full ${
                      document.status === "APPROVED"
                        ? "bg-success-500"
                        : document.status === "REJECTED"
                        ? "bg-danger-500"
                        : "bg-warning-500"
                    }`}
                  />
                </div>
              </div>

              {/* Review Stages */}
              <div className="flex items-center justify-between mb-4">
                {[
                  t("roles.officer", "Officer"),
                  t("roles.manager", "Manager"),
                  t("roles.admin", "Admin"),
                ].map((role, roleIndex) => (
                  <React.Fragment key={role}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          roleIndex === 0
                            ? "bg-primary-100 border-primary-300 text-primary-700"
                            : "bg-gray-100 border-gray-300 text-gray-500"
                        }`}
                      >
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-gray-600 mt-1">{role}</span>
                    </div>
                    {roleIndex < 2 && (
                      <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {document.createdAt
                    ? format(new Date(document.createdAt), "MMM dd, yyyy")
                    : t("common.unknownDate", "Unknown date")}
                </div>

                <div className="text-sm text-gray-500">
                  {document.status === "APPROVED"
                    ? "✅ " + t("status.fullyApproved", "Fully Approved")
                    : document.status === "REJECTED"
                    ? "❌ " + t("status.rejected", "Rejected")
                    : "⏳ " + t("status.inReview", "In Review")}
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {(!documents || documents.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {t("documents.noneYet", "No documents yet")}
          </h4>
          <p className="text-gray-600">
            {t(
              "documents.seeProgressHelp",
              "Upload some documents to see their progress here."
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default WorkflowProgress;
