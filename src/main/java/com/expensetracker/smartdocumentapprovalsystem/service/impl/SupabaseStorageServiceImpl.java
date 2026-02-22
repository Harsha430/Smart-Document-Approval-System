package com.expensetracker.smartdocumentapprovalsystem.service.impl;

import com.expensetracker.smartdocumentapprovalsystem.service.SupabaseStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class SupabaseStorageServiceImpl implements SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket}")
    private String bucketName;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String url = String.format("%s/storage/v1/object/%s/%s", supabaseUrl, bucketName, fileName);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseKey);
            headers.set("apikey", supabaseKey);
            headers.setContentType(MediaType.parseMediaType(file.getContentType()));

            HttpEntity<byte[]> entity = new HttpEntity<>(file.getBytes(), headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return fileName;
            } else {
                System.err.println("Supabase Upload Failed!");
                System.err.println("URL: " + url);
                System.err.println("Status: " + response.getStatusCode());
                System.err.println("Response Body: " + response.getBody());
                throw new RuntimeException("Failed to upload file to Supabase: " + response.getBody());
            }
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("IO error during Supabase upload", e);
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.err.println("HttpClientError: " + e.getResponseBodyAsString());
            e.printStackTrace();
            throw new RuntimeException("Supabase API Error: " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public String getPublicUrl(String fileName) {
        return String.format("%s/storage/v1/object/public/%s/%s", supabaseUrl, bucketName, fileName);
    }
}
