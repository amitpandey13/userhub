package com.example.programming.dto;

import com.example.programming.enums.UserStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecentUserDto {

    private Long id;

    private String name;

    private String email;

    private UserStatus status;

}
