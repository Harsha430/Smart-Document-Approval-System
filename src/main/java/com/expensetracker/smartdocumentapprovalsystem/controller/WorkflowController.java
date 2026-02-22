package com.expensetracker.smartdocumentapprovalsystem.controller;

import com.expensetracker.smartdocumentapprovalsystem.dto.ApprovalActionRequest;
import com.expensetracker.smartdocumentapprovalsystem.dto.ApprovalWorkflowResponse;
import com.expensetracker.smartdocumentapprovalsystem.dto.DocumentResponseDTO;
import com.expensetracker.smartdocumentapprovalsystem.dto.UserDto;
import com.expensetracker.smartdocumentapprovalsystem.model.WorkFlow;
import com.expensetracker.smartdocumentapprovalsystem.service.DocumentService;
import com.expensetracker.smartdocumentapprovalsystem.service.UserService;
import com.expensetracker.smartdocumentapprovalsystem.service.WorkFlowService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workflows")
public class WorkflowController {

    @Autowired
    private WorkFlowService workFlowService;

    @Autowired
    private DocumentService documentService;

    @Autowired
    private UserService userService;

    // Get pending workflows for current user (reviewer)
    @GetMapping("/pending")
    public ResponseEntity<List<ApprovalWorkflowResponse>> getPendingWorkflows(Principal principal) {
        UserDto currentUser = userService.getUserByEmail(principal.getName());
        List<WorkFlow> pendingWorkflows = documentService.getPendingWorkflowsForReviewer((long) currentUser.getId());

        List<ApprovalWorkflowResponse> responses = pendingWorkflows.stream()
                .map(this::convertToWorkflowResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    // Get workflow history for a specific document
    @GetMapping("/document/{documentId}")
    public ResponseEntity<List<ApprovalWorkflowResponse>> getDocumentWorkflows(@PathVariable Long documentId) {
        List<WorkFlow> workflows = workFlowService.getWorkflowByDocumentId(documentId);

        List<ApprovalWorkflowResponse> responses = workflows.stream()
                .map(this::convertToWorkflowResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    // Approve or reject a workflow step
    @PostMapping("/action")
    public ResponseEntity<String> processWorkflowAction(@Valid @RequestBody ApprovalActionRequest request, Principal principal) {
        try {
            // Get current user for validation
            UserDto currentUser = userService.getUserByEmail(principal.getName());

            // TODO: Add validation to ensure current user is the assigned reviewer
            // This would require additional logic to check workflow assignment

            // Update workflow status
            WorkFlow updatedWorkflow = workFlowService.updateWorkflowStatus(
                request.getWorkflowId(),
                request.getStatus(),
                request.getComment()
            );

            return ResponseEntity.ok("Workflow action processed successfully for workflow ID: " + updatedWorkflow.getId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing workflow action: " + e.getMessage());
        }
    }

    private ApprovalWorkflowResponse convertToWorkflowResponse(WorkFlow workflow) {
        ApprovalWorkflowResponse response = new ApprovalWorkflowResponse();
        response.setId((long) workflow.getId());
        response.setDocumentId(workflow.getDocument().getId());
        response.setDocumentTitle(workflow.getDocument().getTitle());
        response.setReviewerName(workflow.getReviewer().getName());
        response.setReviewerEmail(workflow.getReviewer().getEmail());
        response.setStatus(workflow.getStatus());
        response.setComment(workflow.getComment());
        response.setReviewedAt(workflow.getReviewedAt());

        // Add uploader information
        response.setUploaderName(workflow.getDocument().getUploadedBy() != null ?
            workflow.getDocument().getUploadedBy().getName() : "Unknown");
        response.setCreatedAt(workflow.getDocument().getCreatedAt());

        // Create a simple document DTO for view functionality
        DocumentResponseDTO documentDTO = new DocumentResponseDTO();
        documentDTO.setId(workflow.getDocument().getId());
        documentDTO.setTitle(workflow.getDocument().getTitle());
        documentDTO.setUploadPath(workflow.getDocument().getUploadPath());
        response.setDocument(documentDTO);

        return response;
    }
}
