package com.expensetracker.smartdocumentapprovalsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String entityType;

    @Column(nullable = false)
    private Long entityId;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private String userName;

    @Column(length = 1000)
    private String details;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column
    private String ipAddress;

    public AuditLog(String action, String entityType, Long entityId, String userEmail, String userName, String details) {
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.userEmail = userEmail;
        this.userName = userName;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }
}
