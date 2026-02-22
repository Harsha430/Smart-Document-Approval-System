package com.expensetracker.smartdocumentapprovalsystem.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class FileStorageUtil {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public String storeFile(MultipartFile file) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // Store file
            Path targetLocation = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return targetLocation.toString();
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file. Please try again!", ex);
        }
    }

    public Path loadFileAsResource(String filePath) {
        try {
            // Check if the filePath is already an absolute path
            Path path = Paths.get(filePath);
            if (path.isAbsolute()) {
                // Use the absolute path directly
                if (Files.exists(path)) {
                    return path;
                } else {
                    throw new RuntimeException("File not found: " + filePath);
                }
            } else {
                // Resolve relative path against upload directory
                Path resolvedPath = Paths.get(uploadDir).resolve(filePath).normalize();
                if (Files.exists(resolvedPath)) {
                    return resolvedPath;
                } else {
                    throw new RuntimeException("File not found: " + filePath);
                }
            }
        } catch (Exception ex) {
            throw new RuntimeException("File not found: " + filePath, ex);
        }
    }
}
