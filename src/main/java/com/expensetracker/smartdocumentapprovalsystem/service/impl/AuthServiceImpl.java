package com.expensetracker.smartdocumentapprovalsystem.service.impl;

import com.expensetracker.smartdocumentapprovalsystem.config.JwtService;
import com.expensetracker.smartdocumentapprovalsystem.dto.AuthResponse;
import com.expensetracker.smartdocumentapprovalsystem.dto.LoginRequest;
import com.expensetracker.smartdocumentapprovalsystem.dto.RegisterRequest;
import com.expensetracker.smartdocumentapprovalsystem.dto.UserDto;
import com.expensetracker.smartdocumentapprovalsystem.model.User;
import com.expensetracker.smartdocumentapprovalsystem.repository.UserRepository;
import com.expensetracker.smartdocumentapprovalsystem.service.AuditService;
import com.expensetracker.smartdocumentapprovalsystem.service.AuthService;
import com.expensetracker.smartdocumentapprovalsystem.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {


    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private AuditService auditService;

    @Override
    public AuthResponse register(RegisterRequest registerRequest) {
        UserDto user = userService.register(registerRequest);
        String token = jwtService.generateToken(user.getEmail());

        // Log audit trail
        auditService.logUserRegistration(user.getEmail(), user.getName());

        return new AuthResponse(token, user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtService.generateToken(user.getEmail());

        UserDto userDto = modelMapper.map(user, UserDto.class);

        // Log audit trail
        auditService.logUserLogin(user.getEmail(), user.getName());

        return new AuthResponse(token, userDto);
    }


    @Override
    public UserDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return modelMapper.map(user, UserDto.class);
    }
}
