package com.example.programming.serviceImplementation;

import com.example.programming.Repositories.UserRepo;
import com.example.programming.entities.User;
import com.example.programming.enums.AuditAction;
import com.example.programming.services.AuditLogService;
import com.example.programming.utils.SecurityUtil;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExcelExportServiceImplementation {

    @Autowired
    private UserRepo userRepository;
    private final SecurityUtil securityUtil;
    private final AuditLogService auditLogService;

    public ExcelExportServiceImplementation(SecurityUtil securityUtil, AuditLogService auditLogService) {
        this.securityUtil = securityUtil;
        this.auditLogService = auditLogService;
    }

    public ByteArrayInputStream exportUsers() throws IOException {

        List<User> users = userRepository.findAll();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Users");

        // Header Style
        CellStyle headerStyle = workbook.createCellStyle();

        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex());

        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.GREY_50_PERCENT.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        // Header Row
        Row headerRow = sheet.createRow(0);

        String[] headers = {
                "ID",
                "Name",
                "Email"

        };

        for (int i = 0; i < headers.length; i++) {

            Cell cell = headerRow.createCell(i);

            cell.setCellValue(headers[i]);

            cell.setCellStyle(headerStyle);
        }

        // Data Rows
        int rowNum = 1;

        for (User user : users) {

            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(user.getUserId());

            row.createCell(1).setCellValue(user.getName());

            row.createCell(2).setCellValue(user.getEmail());



        }

        // Auto Size Columns
        for (int i = 0; i < headers.length; i++) {

            sheet.autoSizeColumn(i);

        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        workbook.write(out);

        workbook.close();
        auditLogService.log(

                securityUtil.getCurrentUser(),

                null,

                AuditAction.EXPORT_EXCEL,

                "Exported user list to Excel.",

                null

        );

        return new ByteArrayInputStream(out.toByteArray());

    }

}
