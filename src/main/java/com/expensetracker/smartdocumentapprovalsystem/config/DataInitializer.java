package com.expensetracker.smartdocumentapprovalsystem.config;

import com.expensetracker.smartdocumentapprovalsystem.model.Role;
import com.expensetracker.smartdocumentapprovalsystem.model.User;
import com.expensetracker.smartdocumentapprovalsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if users already exist to avoid duplicates
        if (userRepository.count() == 0) {
            createSampleUsers();
        }
    }

    private void createSampleUsers() {
        // Create Admin user
        User admin = new User();
        admin.setName("System Admin");
        admin.setEmail("admin@documentapproval.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        // Create Manager user
        User manager = new User();
        manager.setName("John Manager");
        manager.setEmail("manager@documentapproval.com");
        manager.setPassword(passwordEncoder.encode("manager123"));
        manager.setRole(Role.MANAGER);
        userRepository.save(manager);

        // Create Officer user
        User officer = new User();
        officer.setName("Jane Officer");
        officer.setEmail("officer@documentapproval.com");
        officer.setPassword(passwordEncoder.encode("officer123"));
        officer.setRole(Role.OFFICER);
        userRepository.save(officer);

        // Create regular users
        User user1 = new User();
        user1.setName("Alice Smith");
        user1.setEmail("alice@documentapproval.com");
        user1.setPassword(passwordEncoder.encode("user123"));
        user1.setRole(Role.USER);
        userRepository.save(user1);

        User user2 = new User();
        user2.setName("Bob Johnson");
        user2.setEmail("bob@documentapproval.com");
        user2.setPassword(passwordEncoder.encode("user123"));
        user2.setRole(Role.USER);
        userRepository.save(user2);

        System.out.println("Sample users created successfully!");
        System.out.println("Admin: admin@documentapproval.com / admin123");
        System.out.println("Manager: manager@documentapproval.com / manager123");
        System.out.println("Officer: officer@documentapproval.com / officer123");
        System.out.println("User1: alice@documentapproval.com / user123");
        System.out.println("User2: bob@documentapproval.com / user123");
    }
}
