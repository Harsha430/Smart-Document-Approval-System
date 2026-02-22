package com.expensetracker.smartdocumentapprovalsystem.service.impl;

import com.expensetracker.smartdocumentapprovalsystem.dto.Status;
import com.expensetracker.smartdocumentapprovalsystem.model.Document;
import com.expensetracker.smartdocumentapprovalsystem.model.Role;
import com.expensetracker.smartdocumentapprovalsystem.model.User;
import com.expensetracker.smartdocumentapprovalsystem.model.WorkFlow;
import com.expensetracker.smartdocumentapprovalsystem.repository.DocumentRepository;
import com.expensetracker.smartdocumentapprovalsystem.repository.UserRepository;
import com.expensetracker.smartdocumentapprovalsystem.repository.WorkFlowRepository;
import com.expensetracker.smartdocumentapprovalsystem.service.AuditService;
import com.expensetracker.smartdocumentapprovalsystem.service.EmailService;
import com.expensetracker.smartdocumentapprovalsystem.service.WorkFlowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkFlowServiceImpl implements WorkFlowService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkFlowRepository workFlowRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuditService auditService;


    public void createDefaultWorkflow(Document document) {
        User officer = userRepository.findFirstByRole(Role.OFFICER)
                .orElseThrow(() -> new RuntimeException("No OFFICER found"));
        User manager = userRepository.findFirstByRole(Role.MANAGER)
                .orElseThrow(() -> new RuntimeException("No MANAGER found"));
        User admin   = userRepository.findFirstByRole(Role.ADMIN)
                .orElseThrow(() -> new RuntimeException("No ADMIN found"));

        WorkFlow step1 = new WorkFlow(0, document, officer, Status.PENDING, null, null);
        WorkFlow step2 = new WorkFlow(0, document, manager, Status.PENDING, null, null);
        WorkFlow step3 = new WorkFlow(0, document, admin, Status.PENDING, null, null);

        workFlowRepository.saveAll(List.of(step1, step2, step3));
    }


    @Override
    public List<WorkFlow> getWorkflowByDocumentId(Long documentId) {
        return workFlowRepository.findByDocumentId(documentId);
    }

    @Override
    public WorkFlow updateWorkflowStatus(Long workflowId, Status status, String comment) {
        WorkFlow wf = workFlowRepository.findById(workflowId)
                .orElseThrow(() -> new RuntimeException("Workflow not found"));

        wf.setStatus(status);
        wf.setComment(comment);
        wf.setReviewedAt(LocalDateTime.now());

        WorkFlow savedWorkflow = workFlowRepository.save(wf);

        // Log audit trail
        Document document = savedWorkflow.getDocument();
        if (document != null && savedWorkflow.getReviewer() != null) {
            auditService.logDocumentReview(
                document.getId(),
                savedWorkflow.getReviewer().getEmail(),
                savedWorkflow.getReviewer().getName(),
                status.name(),
                comment
            );
        }

        // Send email notification to document uploader about the status change
        if (document != null && document.getUploadedBy() != null) {
            emailService.sendDocumentApprovalNotification(
                document.getUploadedBy().getEmail(),
                document.getTitle(),
                status.name()
            );
        }

        // If approved by current reviewer, notify next reviewer in the chain
        if (status == Status.APPROVED) {
            notifyNextReviewer(document);
        } else if (status == Status.REJECTED) {
            // If rejected, immediately update document status to rejected
            document.setStatus(Status.REJECTED);
            document.setComment(comment); // Store rejection reason in document
            document.setReviewedAt(LocalDateTime.now());
            documentRepository.save(document);
        }

        // Check if all workflows are complete and update document status
        updateDocumentStatusIfComplete(document);

        return savedWorkflow;
    }

    private void notifyNextReviewer(Document document) {
        // Find the next pending workflow for this document
        List<WorkFlow> pendingWorkflows = workFlowRepository.findByDocumentId(document.getId())
                .stream()
                .filter(wf -> wf.getStatus() == Status.PENDING)
                .toList();

        if (!pendingWorkflows.isEmpty()) {
            WorkFlow nextWorkflow = pendingWorkflows.get(0);
            User nextReviewer = nextWorkflow.getReviewer();

            emailService.sendDocumentUploadNotification(
                nextReviewer.getEmail(),
                document.getTitle(),
                document.getUploadedBy().getName()
            );
        }
    }

    private void updateDocumentStatusIfComplete(Document document) {
        List<WorkFlow> allWorkflows = workFlowRepository.findByDocumentId(document.getId());

        // Check if any workflow is rejected
        boolean hasRejected = allWorkflows.stream()
                .anyMatch(wf -> wf.getStatus() == Status.REJECTED);

        if (hasRejected) {
            // If any workflow is rejected, mark document as rejected
            // Find the rejection comment from the rejected workflow
            String rejectionComment = allWorkflows.stream()
                    .filter(wf -> wf.getStatus() == Status.REJECTED)
                    .map(WorkFlow::getComment)
                    .filter(comment -> comment != null && !comment.trim().isEmpty())
                    .findFirst()
                    .orElse("Document rejected");

            document.setStatus(Status.REJECTED);
            document.setComment(rejectionComment);
            document.setReviewedAt(LocalDateTime.now());
            documentRepository.save(document);
            return;
        }

        // Check if all workflows are approved
        boolean allApproved = allWorkflows.stream()
                .allMatch(wf -> wf.getStatus() == Status.APPROVED);

        if (allApproved) {
            // If all workflows are approved, mark document as approved
            document.setStatus(Status.APPROVED);
            document.setReviewedAt(LocalDateTime.now());
            documentRepository.save(document);

            // Send final approval notification
            if (document.getUploadedBy() != null) {
                emailService.sendDocumentApprovalNotification(
                    document.getUploadedBy().getEmail(),
                    document.getTitle(),
                    "APPROVED - All reviews completed successfully"
                );
            }
        }
    }

}
