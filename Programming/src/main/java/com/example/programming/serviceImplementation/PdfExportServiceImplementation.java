package com.example.programming.serviceImplementation;


import com.example.programming.Repositories.UserRepo;
import com.example.programming.entities.User;
import com.example.programming.enums.AuditAction;
import com.example.programming.services.AuditLogService;
import com.example.programming.utils.SecurityUtil;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PdfExportServiceImplementation {

    @Autowired
    private UserRepo userRepository;
    private final SecurityUtil securityUtil;
    private final AuditLogService auditLogService;

    public PdfExportServiceImplementation(SecurityUtil securityUtil, AuditLogService auditLogService) {
        this.securityUtil = securityUtil;
        this.auditLogService = auditLogService;
    }

    public ByteArrayInputStream exportUsers() {

        List<User> users = userRepository.findAll();

        Document document = new Document(PageSize.A4);

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {

            PdfWriter.getInstance(document, out);

            document.open();

            Font titleFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    18,
                    Color.BLACK
            );

            Paragraph title = new Paragraph("USER REPORT", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);

            document.add(title);

            PdfPTable table = new PdfPTable(4);

            table.setWidthPercentage(100);

            table.setWidths(new int[]{1, 3, 5, 3});

            Font headerFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    12,
                    Color.WHITE
            );

            String[] headers = {
                    "ID",
                    "Name",
                    "Email",

            };

            for (String header : headers) {

                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));

                cell.setBackgroundColor(Color.DARK_GRAY);

                cell.setHorizontalAlignment(Element.ALIGN_CENTER);

                cell.setPadding(8);

                table.addCell(cell);

            }

            for (User user : users) {

                table.addCell(String.valueOf(user.getUserId()));
                table.addCell(user.getName());
                table.addCell(user.getEmail());


            }

            document.add(table);

            document.close();

        } catch (Exception e) {

            throw new RuntimeException(e);

        }
        auditLogService.log(

                securityUtil.getCurrentUser(),

                null,

                AuditAction.EXPORT_PDF,

                "Exported user list to PDF.",

                null

        );
        return new ByteArrayInputStream(out.toByteArray());

    }

}