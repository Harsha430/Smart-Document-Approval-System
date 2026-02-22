package com.expensetracker.smartdocumentapprovalsystem.service;

import com.expensetracker.smartdocumentapprovalsystem.dto.RegisterRequest;
import com.expensetracker.smartdocumentapprovalsystem.dto.UserDto;
import com.expensetracker.smartdocumentapprovalsystem.model.User;

public interface UserService {

    UserDto register(RegisterRequest registerRequest);

    UserDto getUserByEmail(String email);

    User getUserEntityByEmail(String email);
}
