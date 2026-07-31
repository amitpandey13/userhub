package com.example.programming.serviceImplementation;

import com.example.programming.Repositories.UserRepo;
import com.example.programming.entities.User;
import com.example.programming.enums.AuditAction;
import com.example.programming.services.AuditLogService;
import com.example.programming.utils.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@Service
public class CsvExportServiceImplementation {

    @Autowired
    private UserRepo userRepository;
    private final SecurityUtil securityUtil;
    private final AuditLogService auditLogService;

    public CsvExportServiceImplementation(SecurityUtil securityUtil, AuditLogService auditLogService) {
        this.securityUtil = securityUtil;
        this.auditLogService = auditLogService;
    }

    public ByteArrayInputStream exportUsers() throws IOException {

        List<User> users = userRepository.findAll();

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PrintWriter writer = new PrintWriter(out);

        // Header
        writer.println("Id,Name,Email");

        // Data
        for (User user : users) {

            writer.println(
                    user.getUserId() + "," +
                            user.getName() + "," +
                            user.getEmail() + ","

            );
        }

        writer.flush();
        auditLogService.log(

                securityUtil.getCurrentUser(),

                null,

                AuditAction.EXPORT_CSV,

                "Exported user to CSV.",

                null

        );

        return new ByteArrayInputStream(out.toByteArray());
    }
}