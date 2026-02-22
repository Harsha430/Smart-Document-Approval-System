package com.expensetracker.smartdocumentapprovalsystem.service;

import com.expensetracker.smartdocumentapprovalsystem.model.AuditLog;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditService {
    
    void logAction(String action, String entityType, Long entityId, String userEmail, String userName, String details);
    
    void logDocumentUpload(Long documentId, String userEmail, String userName, String documentTitle);
    
    void logDocumentReview(Long documentId, String userEmail, String userName, String status, String comment);
    
    void logUserLogin(String userEmail, String userName);
    
    void logUserRegistration(String userEmail, String userName);
    
    List<AuditLog> getAuditLogsByUser(String userEmail);
    
    List<AuditLog> getAuditLogsByEntity(String entityType, Long entityId);
    
    List<AuditLog> getAuditLogsByDateRange(LocalDateTime start, LocalDateTime end);
    
    List<AuditLog> getAllAuditLogs();
}
