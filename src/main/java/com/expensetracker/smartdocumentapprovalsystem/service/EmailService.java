package com.expensetracker.smartdocumentapprovalsystem.service;

import com.expensetracker.smartdocumentapprovalsystem.dto.EmailDetailsDto;

public interface EmailService {
    void sendEmail(EmailDetailsDto emailDetails);
    void sendDocumentUploadNotification(String reviewerEmail, String documentTitle, String uploaderName);
    void sendDocumentApprovalNotification(String uploaderEmail, String documentTitle, String status);
}
