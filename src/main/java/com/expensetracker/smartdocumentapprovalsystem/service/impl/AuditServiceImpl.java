package com.expensetracker.smartdocumentapprovalsystem.service.impl;

import com.expensetracker.smartdocumentapprovalsystem.model.AuditLog;
import com.expensetracker.smartdocumentapprovalsystem.repository.AuditLogRepository;
import com.expensetracker.smartdocumentapprovalsystem.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditServiceImpl implements AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Override
    public void logAction(String action, String entityType, Long entityId, String userEmail, String userName, String details) {
        try {
            AuditLog auditLog = new AuditLog(action, entityType, entityId, userEmail, userName, details);
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            // Log error but don't fail the main operation
            System.err.println("Failed to save audit log: " + e.getMessage());
        }
    }

    @Override
    public void logDocumentUpload(Long documentId, String userEmail, String userName, String documentTitle) {
        String details = "Document uploaded: " + documentTitle;
        logAction("DOCUMENT_UPLOAD", "Document", documentId, userEmail, userName, details);
    }

    @Override
    public void logDocumentReview(Long documentId, String userEmail, String userName, String status, String comment) {
        String details = "Document reviewed with status: " + status + 
                        (comment != null && !comment.isEmpty() ? ". Comment: " + comment : "");
        logAction("DOCUMENT_REVIEW", "Document", documentId, userEmail, userName, details);
    }

    @Override
    public void logUserLogin(String userEmail, String userName) {
        logAction("USER_LOGIN", "User", null, userEmail, userName, "User logged in");
    }

    @Override
    public void logUserRegistration(String userEmail, String userName) {
        logAction("USER_REGISTRATION", "User", null, userEmail, userName, "User registered");
    }

    @Override
    public List<AuditLog> getAuditLogsByUser(String userEmail) {
        return auditLogRepository.findByUserEmailOrderByTimestampDesc(userEmail);
    }

    @Override
    public List<AuditLog> getAuditLogsByEntity(String entityType, Long entityId) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByTimestampDesc(entityType, entityId);
    }

    @Override
    public List<AuditLog> getAuditLogsByDateRange(LocalDateTime start, LocalDateTime end) {
        return auditLogRepository.findByTimestampBetweenOrderByTimestampDesc(start, end);
    }

    @Override
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }
}
