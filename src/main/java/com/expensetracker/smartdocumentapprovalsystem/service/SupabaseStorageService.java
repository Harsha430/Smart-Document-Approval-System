package com.expensetracker.smartdocumentapprovalsystem.service;

import org.springframework.web.multipart.MultipartFile;

public interface SupabaseStorageService {
    String uploadFile(MultipartFile file);
    String getPublicUrl(String fileName);
}
