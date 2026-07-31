package com.example.programming.dto;

public class LoginResponse {

    private String token;
    private String email;
    private String role;
    private String message;

    public LoginResponse(
            String token,
            String email,
            String role,
            String message
    ) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getMessage() {
        return message;
    }
}