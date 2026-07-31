package com.example.programming.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImportError {

    private int rowNumber;

    private String name;

    private String email;

    private String reason;

}