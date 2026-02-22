package com.expensetracker.smartdocumentapprovalsystem.service;

import com.expensetracker.smartdocumentapprovalsystem.dto.Status;
import com.expensetracker.smartdocumentapprovalsystem.model.Document;
import com.expensetracker.smartdocumentapprovalsystem.model.WorkFlow;

import java.util.List;

public interface WorkFlowService {
    void createDefaultWorkflow(Document document);
    List<WorkFlow> getWorkflowByDocumentId(Long documentId);
    WorkFlow updateWorkflowStatus(Long workflowId, Status status, String comment);

}
