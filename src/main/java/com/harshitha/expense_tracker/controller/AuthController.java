package com.harshitha.expense_tracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.harshitha.expense_tracker.dto.LoginRequest;
import com.harshitha.expense_tracker.dto.RegisterRequest;
import com.harshitha.expense_tracker.dto.AuthResponse;
import com.harshitha.expense_tracker.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {

        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        return authService.login(request);
    }

    @PostMapping("/upgrade")
    public AuthResponse upgrade(@RequestParam String email) {
        return authService.upgradeRole(email);
    }
}