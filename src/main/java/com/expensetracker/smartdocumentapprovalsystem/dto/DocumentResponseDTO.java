package com.expensetracker.smartdocumentapprovalsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentResponseDTO {
    private Long id;
    private String title;
    private Status status;
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
    private String comment;
    private String uploadPath;
    private String uploadedBy; // Just the name, not the full user object
    private int progressPercentage; // Progress based on completed workflows
    private int completedWorkflows; // Number of completed workflows
    private int totalWorkflows; // Total number of workflows (usually 3)
}
