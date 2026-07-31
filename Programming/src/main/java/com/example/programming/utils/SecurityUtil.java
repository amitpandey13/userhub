package com.example.programming.utils;

import com.example.programming.Repositories.UserRepo;
import com.example.programming.entities.User;
import com.example.programming.exception.UserNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {

    private final UserRepo userRepo;

    public SecurityUtil(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        System.out.println("Authentication Name: " + authentication.getName());

        String email = authentication.getName();

        return userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));
    }

}