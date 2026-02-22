package com.expensetracker.smartdocumentapprovalsystem.utils;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Component
public class PDFUtil {

    /**
     * Validates if the uploaded file is a PDF
     */
    public boolean isPDF(String filename) {
        return filename != null && filename.toLowerCase().endsWith(".pdf");
    }

    /**
     * Validates PDF file content by checking magic bytes
     */
    public boolean isValidPDF(Path filePath) {
        try {
            byte[] fileBytes = Files.readAllBytes(filePath);
            if (fileBytes.length < 4) {
                return false;
            }

            // Check PDF magic bytes: %PDF
            return fileBytes[0] == 0x25 && // %
                   fileBytes[1] == 0x50 && // P
                   fileBytes[2] == 0x44 && // D
                   fileBytes[3] == 0x46;   // F
        } catch (IOException e) {
            return false;
        }
    }

    /**
     * Gets file size in MB
     */
    public double getFileSizeInMB(Path filePath) {
        try {
            long sizeInBytes = Files.size(filePath);
            return sizeInBytes / (1024.0 * 1024.0);
        } catch (IOException e) {
            return 0;
        }
    }

    /**
     * Validates file size (max 10MB)
     */
    public boolean isValidFileSize(Path filePath, double maxSizeMB) {
        double fileSizeMB = getFileSizeInMB(filePath);
        return fileSizeMB <= maxSizeMB;
    }
}
