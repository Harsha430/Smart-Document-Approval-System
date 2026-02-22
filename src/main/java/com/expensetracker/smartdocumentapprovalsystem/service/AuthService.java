package com.expensetracker.smartdocumentapprovalsystem.service;

import com.expensetracker.smartdocumentapprovalsystem.dto.AuthResponse;
import com.expensetracker.smartdocumentapprovalsystem.dto.LoginRequest;
import com.expensetracker.smartdocumentapprovalsystem.dto.RegisterRequest;
import com.expensetracker.smartdocumentapprovalsystem.dto.UserDto;

public interface AuthService {

    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse login(LoginRequest loginRequest);
    UserDto getCurrentUser();
}

