package com.example.programming.dto;

import com.example.programming.enums.AuditAction;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogDto {

    private int id;

    private String performedBy;

    private String targetUser;

    private AuditAction action;

    private String description;

    private String ipAddress;

    private LocalDateTime createdAt;

}