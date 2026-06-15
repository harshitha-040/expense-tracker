package com.harshitha.expense_tracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.harshitha.expense_tracker.dto.RegisterRequest;
import com.harshitha.expense_tracker.dto.LoginRequest;
import com.harshitha.expense_tracker.dto.AuthResponse;
import com.harshitha.expense_tracker.entity.User;
import com.harshitha.expense_tracker.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new AuthResponse("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        // Determine role based on plan
        if ("Pro".equalsIgnoreCase(request.getPlan()) || "Family".equalsIgnoreCase(request.getPlan())) {
            user.setRole(User.Role.PREMIUM);
        } else {
            user.setRole(User.Role.FREE);
        }

        userRepository.save(user);
        return new AuthResponse("User Registered Successfully", user);
    }
    
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(request.getEmail())
                .orElse(null);

        if (user == null) {
            return new AuthResponse("User not found");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return new AuthResponse("Invalid password");
        }

        return new AuthResponse("Login Successful", user);
    }

    public AuthResponse upgradeRole(String email) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(email).orElse(null);
        if (user == null) {
            return new AuthResponse("User not found");
        }
        user.setRole(User.Role.PREMIUM);
        userRepository.save(user);
        return new AuthResponse("Account Upgraded to PREMIUM", user);
    }
}
