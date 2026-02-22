import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Eye,
  Trash2,
  Calendar,
  User,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Dropdown } from "flowbite-react";
import api from "../../services/api";
import { useAuthStore } from "../../stores/authStore";
import { useTranslation } from "react-i18next";

const DocumentCard = ({ document, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { t } = useTranslation("common");

  // Check if current user can delete this document
  const canDelete =
    isAuthenticated &&
    user &&
    document.uploadedBy === user.name &&
    document.status === "PENDING";

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

  const getProgressPercentage = (document) => {
    // Use the progressPercentage from the backend if available
    if (document.progressPercentage !== undefined) {
      return document.progressPercentage;
    }

    // Fallback calculation
    switch (document.status) {
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

  const handleDownload = async () => {
    try {
      // Implement download logic
      console.log("Downloading document:", document.id);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleViewDocument = async () => {
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

  const handleDelete = async () => {
    if (!isAuthenticated) {
      alert("Please log in to delete documents.");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this document? This action cannot be undone."
      )
    ) {
      try {
        // Use the configured api instance instead of raw fetch
        const response = await api.delete(`/documents/${document.id}`);

        // Refresh the documents list
        if (onDelete) {
          onDelete(document.id);
        }
        // Show success message
        alert("Document deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        if (error.response?.status === 403) {
          alert("You can only delete your own pending documents.");
        } else if (error.response?.status === 400) {
          alert(
            "Cannot delete documents that are already approved or rejected."
          );
        } else if (error.response?.status === 401) {
          alert("Please log in again to delete documents.");
        } else {
          alert("Failed to delete document. Please try again.");
        }
      }
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      {/* Status Bar */}
      <div
        className={`h-1 w-full ${
          document.status === "APPROVED"
            ? "bg-gradient-to-r from-green-400 to-emerald-500"
            : document.status === "REJECTED"
            ? "bg-gradient-to-r from-red-400 to-rose-500"
            : "bg-gradient-to-r from-yellow-400 to-amber-500"
        }`}
      />

      {/* Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1 min-w-0">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                document.status === "APPROVED"
                  ? "bg-green-50 group-hover:bg-green-100"
                  : document.status === "REJECTED"
                  ? "bg-red-50 group-hover:bg-red-100"
                  : "bg-blue-50 group-hover:bg-blue-100"
              }`}
            >
              <FileText
                className={`w-6 h-6 ${
                  document.status === "APPROVED"
                    ? "text-green-600"
                    : document.status === "REJECTED"
                    ? "text-red-600"
                    : "text-blue-600"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 leading-tight">
                <span className="block truncate" title={document.title}>
                  {document.title}
                </span>
              </h3>
              <div className="flex items-center space-x-2 mt-2">
                {getStatusIcon(document.status)}
                <span
                  className={`${getStatusBadge(
                    document.status
                  )} text-xs font-semibold px-3 py-1 rounded-full`}
                >
                  {t(`status.${document.status}`, document.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions Dropdown */}
          <Dropdown
            label=""
            dismissOnClick={false}
            renderTrigger={() => (
              <button
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isHovered
                    ? "opacity-100 bg-gray-100 hover:bg-gray-200"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
            )}
          >
            <Dropdown.Item onClick={handleViewDocument}>
              <Eye className="w-4 h-4 mr-2" />
              {t("documents.view")}
            </Dropdown.Item>
            <Dropdown.Item onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              {t("documents.download", "Download")}
            </Dropdown.Item>
            {canDelete && (
              <>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleDelete} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t("common.delete", "Delete")}
                </Dropdown.Item>
              </>
            )}
          </Dropdown>
        </div>

        {/* Progress Bar for Pending Documents */}
        {document.status === "PENDING" && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-blue-700">
                {t("documents.reviewProgress")}
              </span>
              <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {getProgressPercentage(document)}%
              </span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage(document)}%` }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full shadow-sm"
              />
            </div>
            <div className="flex justify-between text-xs font-medium text-blue-600 mt-2">
              <span>{t("roles.officer")}</span>
              <span>{t("roles.manager")}</span>
              <span>{t("roles.admin")}</span>
            </div>
          </div>
        )}

        {/* Document Info */}
        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <Calendar className="w-4 h-4 mr-3 text-gray-400" />
            <span className="font-medium">
              {t("documents.uploadedOn", "Uploaded")}{" "}
              {document.createdAt
                ? format(new Date(document.createdAt), "MMM dd, yyyy")
                : t("common.unknownDate")}
            </span>
          </div>

          {document.uploadedBy && (
            <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <User className="w-4 h-4 mr-3 text-gray-400" />
              <span className="font-medium">
                {t("documents.uploadedBy", "Uploaded by")} {document.uploadedBy}
              </span>
            </div>
          )}

          {document.comment && (
            <div
              className={`rounded-xl p-4 border-l-4 ${
                document.status === "REJECTED"
                  ? "bg-gradient-to-r from-red-50 to-rose-50 border-l-red-400 border border-red-200"
                  : "bg-gradient-to-r from-gray-50 to-slate-50 border-l-gray-400 border border-gray-200"
              }`}
            >
              {document.status === "REJECTED" && (
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <p className="text-xs font-bold text-red-700 uppercase tracking-wide">
                    {t("documents.rejectionReason")}
                  </p>
                </div>
              )}
              <p
                className={`text-sm leading-relaxed ${
                  document.status === "REJECTED"
                    ? "text-red-700 font-medium"
                    : "text-gray-700"
                }`}
              >
                {document.comment}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <Link
            to={`/documents/${document.id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 border border-blue-200 hover:border-blue-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            {t("documents.viewDetails", "View Details")}
          </Link>

          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-green-200"
              title={t("documents.download")}
            >
              <Download className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewDocument}
              className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-blue-200"
              title={t("documents.view")}
            >
              <Eye className="w-5 h-5" />
            </motion.button>

            {canDelete && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-red-200"
                title={t("common.delete", "Delete Document")}
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentCard;
