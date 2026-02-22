package com.expensetracker.smartdocumentapprovalsystem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApprovalActionRequest {
    @NotNull(message = "Workflow ID is required")
    private Long workflowId;

    @NotNull(message = "Status is required")
    private Status status; // APPROVED or REJECTED (enum)

    private String comment;
}
