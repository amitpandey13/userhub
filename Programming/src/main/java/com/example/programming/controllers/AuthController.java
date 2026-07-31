package com.example.programming.controllers;

import com.example.programming.Repositories.UserRepo;
import com.example.programming.dto.ForgotPasswordRequest;
import com.example.programming.dto.ResetPasswordRequest;
import com.example.programming.dto.VerifyOtpRequest;
import com.example.programming.services.EmailService;
import com.example.programming.services.OtpService;
import com.example.programming.services.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(
        name = "Authentication",
        description = "Login, Signup, Forgot Password APIs"
)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {

        // Check whether email exists
        if (userRepo.findByEmail(request.getEmail()).isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("User not found.");
        }

        // Generate OTP
        String otp = otpService.generateOtp();

        // Save OTP in database
        otpService.saveOtp(request.getEmail(), otp);

        // Send OTP to email
        emailService.sendOtpEmail(request.getEmail(), otp);

        return ResponseEntity.ok("OTP sent successfully.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        otpService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );

        return ResponseEntity.ok("OTP verified successfully.");
    }


    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        // Verify OTP
        otpService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );

        // Update Password
        userService.updatePassword(
                request.getEmail(),
                request.getNewPassword()
        );

        // Delete OTP
        otpService.deleteOtp(request.getEmail());

        return ResponseEntity.ok("Password changed successfully.");
    }
}


