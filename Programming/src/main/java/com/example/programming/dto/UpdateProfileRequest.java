package com.example.programming.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    private String name;

    private String phoneNumber;

    private String address;

    private String city;

    private String country;

    private LocalDate dateOfBirth;

    private String gender;

    private String bio;

}