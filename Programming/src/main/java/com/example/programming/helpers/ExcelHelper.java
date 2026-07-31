package com.example.programming.helpers;

import com.example.programming.entities.User;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ExcelHelper {

    // Check whether uploaded file is Excel
    public static boolean hasExcelFormat(MultipartFile file) {

        String type = file.getContentType();

        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                .equals(type);
    }

    // Open Workbook
    public static Workbook getWorkbook(InputStream inputStream)
            throws Exception {

        return new XSSFWorkbook(inputStream);
    }

    // Get First Sheet
    public static Sheet getSheet(Workbook workbook) {

        return workbook.getSheetAt(0);
    }

    // Convert Excel Rows into User Objects
    public static List<User> convertExcelToUsers(MultipartFile file) {

        List<User> users = new ArrayList<>();

        try {

            Workbook workbook = getWorkbook(file.getInputStream());

            Sheet sheet = getSheet(workbook);

            Iterator<Row> rows = sheet.iterator();

            // Skip Header Row
            if (rows.hasNext()) {
                rows.next();
            }

            while (rows.hasNext()) {

                Row row = rows.next();

                User user = new User();

                user.setName(
                        row.getCell(0).getStringCellValue()
                );

                user.setEmail(
                        row.getCell(1).getStringCellValue()
                );

                user.setPassword(
                        row.getCell(2).getStringCellValue()
                );

                // Role and Status will be handled
                // inside createUser()

                users.add(user);
            }

            workbook.close();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to read Excel file",
                    e
            );

        }

        return users;
    }

}