package com.example.programming.dto;

import com.example.programming.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Integer userId;

    private String name;

    private String email;
    private String phoneNumber;

    private String address;

    private String city;

    private String country;

    private LocalDate dateOfBirth;

    private String gender;

    private String bio;

    private String profilePicture;

    private String role;

    private UserStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}