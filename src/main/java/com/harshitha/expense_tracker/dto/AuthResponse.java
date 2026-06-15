package com.harshitha.expense_tracker.dto;

import com.harshitha.expense_tracker.entity.User;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthResponse {
    private String message;
    private User user;

    public AuthResponse(String message) {
        this.message = message;
    }

    public AuthResponse(String message, User user) {
        this.message = message;
        this.user = user;
        // Don't send password hash back to the frontend
        if (this.user != null) {
            this.user.setPasswordHash(null);
        }
    }
}
