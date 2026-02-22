package com.expensetracker.smartdocumentapprovalsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApprovalWorkflowResponse {
    private Long id;
    private Long documentId;
    private String documentTitle;
    private String reviewerName;
    private String reviewerEmail;
    private Status status;
    private String comment;
    private LocalDateTime reviewedAt;
    private String uploaderName;
    private LocalDateTime createdAt;
    private DocumentResponseDTO document; // Include full document info for view functionality
}
