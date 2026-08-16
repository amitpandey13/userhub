package com.example.programming.services;

import com.example.programming.Repositories.UserRepo;
import com.example.programming.dto.LoginRequest;
import com.example.programming.dto.LoginResponse;
import com.example.programming.entities.User;
import com.example.programming.jwt.JwtService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.Authentication;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
public class AuthenticationService {


    private final UserRepo userRepository;
    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;



    public AuthenticationService(
            UserRepo userRepository, AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;

        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;

    }



    public LoginResponse login(
            LoginRequest request
    ) {


            Authentication authentication =
                    authenticationManager.authenticate(

                            new UsernamePasswordAuthenticationToken(
                                    request.getEmail(),
                                    request.getPassword()
                            )

                    );


        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(userDetails);

// Load your User entity
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        return new LoginResponse(
                token,
                user.getEmail(),
                user.getRole().getName().name(),
                "Login successful");


    }

}
