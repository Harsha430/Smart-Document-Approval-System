package com.expensetracker.smartdocumentapprovalsystem.service.impl;

import com.expensetracker.smartdocumentapprovalsystem.dto.Status;
import com.expensetracker.smartdocumentapprovalsystem.exception.DocumentNotFoundException;
import com.expensetracker.smartdocumentapprovalsystem.model.Document;
import com.expensetracker.smartdocumentapprovalsystem.model.Role;
import com.expensetracker.smartdocumentapprovalsystem.model.User;
import com.expensetracker.smartdocumentapprovalsystem.model.WorkFlow;
import com.expensetracker.smartdocumentapprovalsystem.repository.DocumentRepository;
import com.expensetracker.smartdocumentapprovalsystem.repository.UserRepository;
import com.expensetracker.smartdocumentapprovalsystem.repository.WorkFlowRepository;
import com.expensetracker.smartdocumentapprovalsystem.service.AuditService;
import com.expensetracker.smartdocumentapprovalsystem.service.DocumentService;
import com.expensetracker.smartdocumentapprovalsystem.service.EmailService;
import com.expensetracker.smartdocumentapprovalsystem.service.SupabaseStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final WorkFlowRepository workFlowRepository;
    private final SupabaseStorageService supabaseStorageService;
    private final EmailService emailService;
    private final AuditService auditService;

    @Override
    public Document createDocument(MultipartFile file, String title, int uploaderId) {
        User uploader = userRepository.findById(uploaderId)
                .orElseThrow(() -> new RuntimeException("Uploader not found"));

        // Store the file and get the path (now just the filename)
        String filePath = supabaseStorageService.uploadFile(file);

        Document document = new Document();
        document.setTitle(title);
        document.setUploadPath(filePath);
        document.setUploadedBy(uploader);
        document.setCreatedAt(LocalDateTime.now());
        document.setStatus(Status.PENDING);

        Document savedDoc = documentRepository.save(document);
        createDefaultWorkflow(savedDoc);

        // Log audit trail
        auditService.logDocumentUpload(savedDoc.getId(), uploader.getEmail(), uploader.getName(), title);

        // Send email notification to the first reviewer (Officer)
        User officer = userRepository.findFirstByRole(Role.OFFICER).orElse(null);
        if (officer != null) {
            emailService.sendDocumentUploadNotification(
                officer.getEmail(),
                savedDoc.getTitle(),
                uploader.getName()
            );
        }

        return savedDoc;
    }

    @Override
    public Document createDocument(Document document, int uploaderId) {
        User uploader = userRepository.findById(uploaderId)
                .orElseThrow(() -> new RuntimeException("Uploader not found"));

        document.setUploadedBy(uploader);
        document.setCreatedAt(LocalDateTime.now());
        document.setStatus(Status.PENDING);
        Document savedDoc = documentRepository.save(document);

        createDefaultWorkflow(savedDoc);
        return savedDoc;
    }

    private void createDefaultWorkflow(Document document) {
        User officer = userRepository.findFirstByRole(Role.OFFICER)
                .orElseThrow(() -> new RuntimeException("No OFFICER found"));
        User manager = userRepository.findFirstByRole(Role.MANAGER)
                .orElseThrow(() -> new RuntimeException("No MANAGER found"));
        User admin = userRepository.findFirstByRole(Role.ADMIN)
                .orElseThrow(() -> new RuntimeException("No ADMIN found"));

        WorkFlow step1 = new WorkFlow(0, document, officer, Status.PENDING, null, null);
        WorkFlow step2 = new WorkFlow(0, document, manager, Status.PENDING, null, null);
        WorkFlow step3 = new WorkFlow(0, document, admin, Status.PENDING, null, null);

        workFlowRepository.saveAll(List.of(step1, step2, step3));
    }

    @Override
    public List<Document> getDocumentsByUser(Long userId) {
        return documentRepository.findByUploadedById(userId);
    }

    @Override
    public List<WorkFlow> getPendingWorkflowsForReviewer(Long reviewerId) {
        return workFlowRepository.findByReviewerIdAndStatus(reviewerId, Status.PENDING);
    }

    @Override
    public void reviewDocument(Long workflowId, Status status, String comment) {
        WorkFlow wf = workFlowRepository.findById(workflowId)
                .orElseThrow(() -> new RuntimeException("Workflow not found"));

        wf.setStatus(status);
        wf.setComment(comment);
        wf.setReviewedAt(LocalDateTime.now());

        workFlowRepository.save(wf);
    }

    @Override
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    @Override
    public Document getDocumentById(Long documentId) {
        return documentRepository.findById(Math.toIntExact(documentId))
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with id: " + documentId));
    }

    @Override
    public void deleteDocument(Long documentId) {
        Document document = getDocumentById(documentId);
        // TODO: Add file deletion logic here if needed
        documentRepository.delete(document);
    }
}
