package com.expensetracker.smartdocumentapprovalsystem.repository;

import com.expensetracker.smartdocumentapprovalsystem.model.Role;
import com.expensetracker.smartdocumentapprovalsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    Optional<User> findByName(String name);
    Optional<User> findFirstByRole(Role role);
    Optional<User> findById(Integer id);
}
