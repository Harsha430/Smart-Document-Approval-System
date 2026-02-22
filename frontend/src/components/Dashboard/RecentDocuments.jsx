import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  MoreVertical,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RecentDocuments = ({ documents }) => {
  const { t } = useTranslation("common");
  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-4 h-4 text-success-600" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-danger-600" />;
      default:
        return <Clock className="w-4 h-4 text-warning-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return "status-approved";
      case "REJECTED":
        return "status-rejected";
      case "PENDING":
        return "status-pending";
      default:
        return "status-under-review";
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {t("documents.recent", "Recent Documents")}
          </h3>
          <p className="text-sm text-gray-600">
            {t(
              "documents.latestSubmissions",
              "Your latest document submissions"
            )}
          </p>
        </div>
        <Link
          to="/documents"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-200"
        >
          {t("common.viewAll", "View All")}
        </Link>
      </div>

      <div className="space-y-4">
        {documents.map((document, index) => (
          <motion.div
            key={document.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-primary-200 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {/* Document Icon */}
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-200">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>

                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {document.title}
                    </h4>
                    <span
                      className={`${getStatusBadge(
                        document.status
                      )} flex-shrink-0`}
                    >
                      {t(`status.${document.status}`, document.status)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(document.status)}
                      <span>
                        {document.status === "APPROVED"
                          ? t("status.approved", "Approved")
                          : document.status === "REJECTED"
                          ? t("status.rejected", "Rejected")
                          : t("status.underReview", "Under Review")}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {document.createdAt
                          ? format(new Date(document.createdAt), "MMM dd, yyyy")
                          : t("common.unknownDate", "Unknown date")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                  title={t("documents.view", "View Document")}
                >
                  <Eye className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-400 hover:text-success-600 hover:bg-success-50 rounded-lg transition-all duration-200"
                  title={t("documents.download", "Download Document")}
                >
                  <Download className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title={t("common.moreOptions", "More Options")}
                >
                  <MoreVertical className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Progress Bar for All Documents */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">
                  {t("documents.reviewProgress", "Review Progress")}
                </span>
                <span className="text-xs text-gray-500">
                  {document.status === "APPROVED"
                    ? t("documents.completed", "Completed")
                    : document.status === "REJECTED"
                    ? t("status.rejected", "Rejected")
                    : t("documents.step1of3", "Step 1 of 3")}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      document.progressPercentage ||
                      (document.status === "APPROVED"
                        ? 100
                        : document.status === "REJECTED"
                        ? 100
                        : 33)
                    }%`,
                  }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className={`h-1.5 rounded-full ${
                    document.status === "APPROVED"
                      ? "bg-success-500"
                      : document.status === "REJECTED"
                      ? "bg-danger-500"
                      : "bg-warning-500"
                  }`}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{t("roles.officerReview", "Officer Review")}</span>
                <span>{t("roles.managerReview", "Manager Review")}</span>
                <span>{t("roles.adminApproval", "Admin Approval")}</span>
              </div>

              {/* Show rejection reason if rejected */}
              {document.status === "REJECTED" && document.comment && (
                <div className="mt-2 p-2 bg-danger-50 border border-danger-200 rounded text-xs">
                  <span className="font-medium text-danger-700">
                    {t("documents.rejectionReason", "Rejection Reason: ")}{" "}
                  </span>
                  <span className="text-danger-600">{document.comment}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {documents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {t("documents.noneYet", "No documents yet")}
          </h4>
          <p className="text-gray-600 mb-4">
            {t(
              "documents.startByUploading",
              "Start by uploading your first document"
            )}
          </p>
          <Link
            to="/documents/upload"
            className="btn-primary inline-flex items-center"
          >
            {t("nav.uploadDocument")}
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default RecentDocuments;
