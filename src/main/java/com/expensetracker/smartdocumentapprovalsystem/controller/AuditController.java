package com.expensetracker.smartdocumentapprovalsystem.controller;

import com.expensetracker.smartdocumentapprovalsystem.model.AuditLog;
import com.expensetracker.smartdocumentapprovalsystem.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditController {

    @Autowired
    private AuditService auditService;

    // Get all audit logs (Admin only)
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getAllAuditLogs() {
        List<AuditLog> auditLogs = auditService.getAllAuditLogs();
        return ResponseEntity.ok(auditLogs);
    }

    // Get audit logs for current user
    @GetMapping("/my")
    public ResponseEntity<List<AuditLog>> getMyAuditLogs(Principal principal) {
        List<AuditLog> auditLogs = auditService.getAuditLogsByUser(principal.getName());
        return ResponseEntity.ok(auditLogs);
    }

    // Get audit logs for a specific user (Admin/Manager only)
    @GetMapping("/user/{userEmail}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<AuditLog>> getAuditLogsByUser(@PathVariable String userEmail) {
        List<AuditLog> auditLogs = auditService.getAuditLogsByUser(userEmail);
        return ResponseEntity.ok(auditLogs);
    }

    // Get audit logs for a specific document (Admin/Manager only)
    @GetMapping("/document/{documentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<AuditLog>> getAuditLogsByDocument(@PathVariable Long documentId) {
        List<AuditLog> auditLogs = auditService.getAuditLogsByEntity("Document", documentId);
        return ResponseEntity.ok(auditLogs);
    }

    // Get audit logs by date range (Admin/Manager only)
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<AuditLog>> getAuditLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<AuditLog> auditLogs = auditService.getAuditLogsByDateRange(start, end);
        return ResponseEntity.ok(auditLogs);
    }
}
