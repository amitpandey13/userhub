package com.example.programming.serviceImplementation;

import com.example.programming.Repositories.AuditLogRepository;
import com.example.programming.dto.AuditLogDto;
import com.example.programming.entities.AuditLog;
import com.example.programming.entities.User;
import com.example.programming.enums.AuditAction;
import com.example.programming.services.AuditLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogServiceImpl(AuditLogRepository auditLogRepository) {

        this.auditLogRepository = auditLogRepository;

    }

    @Override
    public void log(

            User performedBy,

            User targetUser,

            AuditAction action,

            String description,

            String ipAddress

    ) {

        AuditLog auditLog = AuditLog.builder()

                .performedBy(performedBy)

                .targetUser(targetUser)

                .action(action)

                .description(description)

                .ipAddress(ipAddress)

                .createdAt(LocalDateTime.now())

                .build();

        auditLogRepository.save(auditLog);

    }
    // helper dto conversion

    private AuditLogDto convertToDto(AuditLog log) {

        return AuditLogDto.builder()
                .id(log.getId())
                .performedBy(
                        log.getPerformedBy() != null
                                ? log.getPerformedBy().getName()
                                : null
                )
                .targetUser(
                        log.getTargetUser() != null
                                ? log.getTargetUser().getName()
                                : null
                )
                .action(log.getAction())
                .description(log.getDescription())
                .ipAddress(log.getIpAddress())
                .createdAt(log.getCreatedAt())
                .build();
    }
    @Override
    public Page<AuditLogDto> getAllLogs(int page, int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending()
        );

        return auditLogRepository.findAll(pageable)
                .map(this::convertToDto);
    }

    @Override
    public Page<AuditLogDto> searchAuditLogs(

            String search,

            AuditAction action,

            int page,

            int size

    ) {

        Page<AuditLog> logs = auditLogRepository.searchAuditLogs(

                search,

                action,

                PageRequest.of(page, size)

        );

        return logs.map(this::convertToDto);

    }

//    @Override
//    public List<AuditLogDto> getAllLogs() {
//
//        return auditLogRepository.findAll()
//
//                .stream()
//
//                .map(log -> AuditLogDto.builder()
//
//                        .id(log.getId())
//
//                        .performedBy(
//                                log.getPerformedBy() != null
//                                        ? log.getPerformedBy().getName()
//                                        : null
//                        )
//
//                        .targetUser(
//                                log.getTargetUser() != null
//                                        ? log.getTargetUser().getName()
//                                        : null
//                        )
//
//                        .action(log.getAction())
//
//                        .description(log.getDescription())
//
//                        .ipAddress(log.getIpAddress())
//
//                        .createdAt(log.getCreatedAt())
//
//                        .build())
//
//                .toList();
//
//    }

}