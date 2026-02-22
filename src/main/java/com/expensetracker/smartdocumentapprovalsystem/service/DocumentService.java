package com.expensetracker.smartdocumentapprovalsystem.service;

import com.expensetracker.smartdocumentapprovalsystem.dto.Status;
import com.expensetracker.smartdocumentapprovalsystem.model.Document;
import com.expensetracker.smartdocumentapprovalsystem.model.WorkFlow;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {
    Document createDocument(MultipartFile file, String title, int uploaderId);
    Document createDocument(Document document, int uploaderId);
    List<Document> getDocumentsByUser(Long userId);
    List<WorkFlow> getPendingWorkflowsForReviewer(Long reviewerId);
    void reviewDocument(Long workflowId, Status status, String comment);
    List<Document> getAllDocuments();
    Document getDocumentById(Long documentId);
    void deleteDocument(Long documentId);
}
