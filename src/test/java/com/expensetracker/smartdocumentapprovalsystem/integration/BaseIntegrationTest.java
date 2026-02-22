package com.expensetracker.smartdocumentapprovalsystem.integration;

import com.expensetracker.smartdocumentapprovalsystem.SmartDocumentApprovalSystemApplication;
import com.expensetracker.smartdocumentapprovalsystem.model.Role;
import com.expensetracker.smartdocumentapprovalsystem.model.User;
import com.expensetracker.smartdocumentapprovalsystem.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(classes = SmartDocumentApprovalSystemApplication.class)
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
public abstract class BaseIntegrationTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    protected User testUser;
    protected User testAdmin;
    protected User testManager;
    protected User testOfficer;

    @BeforeEach
    void setUp() {
        // Clean up database
        userRepository.deleteAll();

        // Create test users
        createTestUsers();
    }

    private void createTestUsers() {
        // Create test user
        testUser = new User();
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setPassword(passwordEncoder.encode("password"));
        testUser.setRole(Role.USER);
        testUser = userRepository.save(testUser);

        // Create test admin
        testAdmin = new User();
        testAdmin.setName("Test Admin");
        testAdmin.setEmail("admin@example.com");
        testAdmin.setPassword(passwordEncoder.encode("password"));
        testAdmin.setRole(Role.ADMIN);
        testAdmin = userRepository.save(testAdmin);

        // Create test manager
        testManager = new User();
        testManager.setName("Test Manager");
        testManager.setEmail("manager@example.com");
        testManager.setPassword(passwordEncoder.encode("password"));
        testManager.setRole(Role.MANAGER);
        testManager = userRepository.save(testManager);

        // Create test officer
        testOfficer = new User();
        testOfficer.setName("Test Officer");
        testOfficer.setEmail("officer@example.com");
        testOfficer.setPassword(passwordEncoder.encode("password"));
        testOfficer.setRole(Role.OFFICER);
        testOfficer = userRepository.save(testOfficer);
    }

    protected String getAuthToken(String email, String password) throws Exception {
        // This method would need to be implemented to get JWT token for testing
        // For now, returning a placeholder
        return "Bearer test-token";
    }
}
