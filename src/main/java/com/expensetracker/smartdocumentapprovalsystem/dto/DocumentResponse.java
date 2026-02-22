package com.expensetracker.smartdocumentapprovalsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentResponse {

    private Long id;
    private String title;
    private Status status;
    private String uploadedBy; // name or email of user
    private LocalDateTime createdAt;
    private String uploadPath;
    private String comment;
    private LocalDateTime reviewedAt;
}
