package com.expensetracker.smartdocumentapprovalsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailDetailsDto {
    private String recipient;     // user email
    private String subject;
    private String body;
}
