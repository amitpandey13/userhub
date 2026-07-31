package com.example.programming.services;

import com.example.programming.dto.ImportError;
import com.example.programming.dto.ImportResult;
import com.example.programming.entities.User;
import com.example.programming.helpers.ExcelHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class ExcelService {

    @Autowired
    private UserService userService;
    private static final Logger logger =
            LoggerFactory.getLogger(ExcelService.class);


    public ImportResult importExcel(MultipartFile file) {
        logger.info("Excel import started. File Name: {}", file.getOriginalFilename());

        List<User> users = ExcelHelper.convertExcelToUsers(file);
        logger.info("Successfully read {} rows from Excel.", users.size());

        ImportResult result = new ImportResult();

        result.setTotalRows(users.size());

        for (int i = 0; i < users.size(); i++) {

            User user = users.get(i);

            int excelRow = i + 2; // Header is row 1

            try {

                // Empty Name
                if (user.getName() == null || user.getName().trim().isEmpty()) {
                    logger.warn(
                            "Empty name at Excel row {}",
                            excelRow
                    );
                    result.getErrors().add(
                            new ImportError(
                                    excelRow,
                                    "",
                                    user.getEmail(),
                                    "Empty Name"
                            )
                    );

                    result.setSkippedRows(result.getSkippedRows() + 1);

                    continue;
                }

                // Empty Email
                if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                    logger.warn(
                            "Empty email at Excel row {}",
                            excelRow
                    );
                    result.getErrors().add(
                            new ImportError(
                                    excelRow,
                                    user.getName(),
                                    "",
                                    "Empty Email"
                            )
                    );

                    result.setSkippedRows(result.getSkippedRows() + 1);

                    continue;
                }

                // Duplicate Email
                if (userService.emailExists(user.getEmail())) {
                    logger.warn(
                            "Duplicate email found at row {} : {}",
                            excelRow,
                            user.getEmail()
                    );
                    result.getErrors().add(
                            new ImportError(
                                    excelRow,
                                    user.getName(),
                                    user.getEmail(),
                                    "Duplicate Email"
                            )
                    );

                    result.setSkippedRows(result.getSkippedRows() + 1);

                    continue;
                }

                // Save User
                userService.createUser(user);
                logger.info(
                        "Imported user : {}",
                        user.getEmail()
                );

                result.setImportedRows(result.getImportedRows() + 1);

            } catch (Exception e) {
                logger.error(
                        "Failed to import row {} : {}",
                        excelRow,
                        e.getMessage(),
                        e
                );
                result.getErrors().add(
                        new ImportError(
                                excelRow,
                                user.getName(),
                                user.getEmail(),
                                e.getMessage()
                        )
                );

                result.setSkippedRows(result.getSkippedRows() + 1);
            }
        }
        logger.info(
                "Excel import completed. Total: {}, Imported: {}, Skipped: {}",
                result.getTotalRows(),
                result.getImportedRows(),
                result.getSkippedRows()
        );
        return result;
    }
}