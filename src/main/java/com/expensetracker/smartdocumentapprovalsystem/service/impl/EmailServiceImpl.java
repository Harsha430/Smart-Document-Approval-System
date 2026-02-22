package com.expensetracker.smartdocumentapprovalsystem.service.impl;

import com.expensetracker.smartdocumentapprovalsystem.dto.EmailDetailsDto;
import com.expensetracker.smartdocumentapprovalsystem.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@documentapproval.com}")
    private String fromEmail;

    @Override
    public void sendEmail(EmailDetailsDto emailDetails) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(emailDetails.getRecipient());
            message.setSubject(emailDetails.getSubject());
            message.setText(emailDetails.getBody());

            mailSender.send(message);
        } catch (Exception e) {
            // Log error but don't fail the main operation
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    @Override
    public void sendDocumentUploadNotification(String reviewerEmail, String documentTitle, String uploaderName) {
        EmailDetailsDto emailDetails = new EmailDetailsDto();
        emailDetails.setRecipient(reviewerEmail);
        emailDetails.setSubject("New Document for Review: " + documentTitle);
        emailDetails.setBody(
            "Dear Reviewer,\n\n" +
            "A new document titled '" + documentTitle + "' has been uploaded by " + uploaderName + " and is pending your review.\n\n" +
            "Please log in to the Document Approval System to review this document.\n\n" +
            "Best regards,\n" +
            "Document Approval System"
        );

        sendEmail(emailDetails);
    }

    @Override
    public void sendDocumentApprovalNotification(String uploaderEmail, String documentTitle, String status) {
        EmailDetailsDto emailDetails = new EmailDetailsDto();
        emailDetails.setRecipient(uploaderEmail);
        emailDetails.setSubject("Document " + status + ": " + documentTitle);
        emailDetails.setBody(
            "Dear User,\n\n" +
            "Your document titled '" + documentTitle + "' has been " + status.toLowerCase() + ".\n\n" +
            "Please log in to the Document Approval System to view the details.\n\n" +
            "Best regards,\n" +
            "Document Approval System"
        );

        sendEmail(emailDetails);
    }
}
