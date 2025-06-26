package com.example.oaTest.Controller;

import com.example.oaTest.Entity.User;
import com.example.oaTest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(new AuthResponse("User registered successfully", registeredUser.getUserId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User authenticatedUser = userService.authenticateUser(user.getEmail(), user.getPassword());
        if (authenticatedUser != null) {
            return ResponseEntity.ok(new AuthResponse("Login successful", authenticatedUser.getUserId()));
        }
        return ResponseEntity.badRequest().body("Invalid credentials");
    }
}

class AuthResponse {
    private String message;
    private Long userId;

    public AuthResponse(String message, Long userId) {
        this.message = message;
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public Long getUserId() {
        return userId;
    }
}