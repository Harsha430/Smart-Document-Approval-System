package com.expensetracker.smartdocumentapprovalsystem.repository;

import com.expensetracker.smartdocumentapprovalsystem.dto.Status;
import com.expensetracker.smartdocumentapprovalsystem.model.WorkFlow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkFlowRepository extends JpaRepository<WorkFlow, Integer> {

    List<WorkFlow> findByReviewerIdAndStatus(Long reviewerId, Status status);

    List<WorkFlow> findByDocumentId(Long documentId);

    Optional<WorkFlow> findById(Long workflowId);
}
