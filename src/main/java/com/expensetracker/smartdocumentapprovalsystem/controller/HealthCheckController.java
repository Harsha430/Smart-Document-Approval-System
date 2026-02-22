package com.expensetracker.smartdocumentapprovalsystem.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthCheckController {

    @GetMapping("/")
    public Map<String, String> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "Smart Document Approval System API is running");
        return status;
    }
}
