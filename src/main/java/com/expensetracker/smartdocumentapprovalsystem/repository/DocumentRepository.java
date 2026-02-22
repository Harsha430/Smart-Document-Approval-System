package com.expensetracker.smartdocumentapprovalsystem.repository;

import com.expensetracker.smartdocumentapprovalsystem.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Integer> {
    List<Document> findByUploadedById(Long userId);

    public interface DocumentService {
        Document uploadDocument(Document document);
        List<Document> getDocumentsUploadedByUser(Long userId);
        Optional<Document> getDocumentById(Long documentId);
    }

}
