package com.example.programming.services;

import com.example.programming.dto.AuditLogDto;
import com.example.programming.entities.User;
import com.example.programming.enums.AuditAction;
import org.springframework.data.domain.Page;

import java.util.List;

public interface AuditLogService {

    void log(

            User performedBy,

            User targetUser,

            AuditAction action,

            String description,

            String ipAddress

    );

    Page<AuditLogDto> getAllLogs(int page, int size);

    Page<AuditLogDto> searchAuditLogs(

            String search,

            AuditAction action,

            int page,

            int size

    );

}