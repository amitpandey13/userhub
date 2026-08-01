package com.example.programming.controllers;


import com.example.programming.dto.*;
import com.example.programming.entities.User;
import com.example.programming.enums.AuditAction;
import com.example.programming.enums.UserStatus;
import com.example.programming.helpers.ExcelHelper;
import com.example.programming.serviceImplementation.CsvExportServiceImplementation;
import com.example.programming.serviceImplementation.ExcelExportServiceImplementation;
import com.example.programming.serviceImplementation.PdfExportServiceImplementation;
import com.example.programming.services.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@Tag(
        name = "Admin Controller",
        description = "Admin Operations File Export & Imports"
)
@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private CsvExportServiceImplementation csvExportServiceImplementation;

    @Autowired
    private ExcelExportServiceImplementation excelExportServiceImplementation;
    @Autowired
    private PdfExportServiceImplementation pdfExportServiceImplementation;

    @Autowired
    private final DashboardService dashboardService;

    @Autowired
    private ExcelService excelService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private final AuditLogService auditLogService;

    public AdminController(DashboardService dashboardService, AuditLogService auditLogService) {
        this.dashboardService = dashboardService;
        this.auditLogService = auditLogService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {

        return ResponseEntity.ok(
                dashboardService.getDashboard()
        );

    }

    @PostMapping("/savedUserByAdmin")
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        return ResponseEntity.ok(userService.createUserByAdmin(user));
    }
    @GetMapping("/getAllUsers")
    public Page<User> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) UserStatus status) {

        return userService.getAllUsers(page, size,status);
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(
            @RequestParam String keyword) {

        return ResponseEntity.ok(userService.searchUsers(keyword));

    }

    @GetMapping("/export/csv")
    public ResponseEntity<InputStreamResource> exportCsv() throws IOException {

        ByteArrayInputStream csv = csvExportServiceImplementation.exportUsers();

        HttpHeaders headers = new HttpHeaders();

        headers.add(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=users.csv"
        );

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(csv));
    }

    @GetMapping("/export/excel")
    public ResponseEntity<InputStreamResource> exportExcel() throws IOException {

        ByteArrayInputStream excel = excelExportServiceImplementation.exportUsers();

        HttpHeaders headers = new HttpHeaders();

        headers.add(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=users.xlsx"
        );

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(excel));
    }

    //export PDF
    @GetMapping("/export/pdf")
    public ResponseEntity<InputStreamResource> exportPdf() {



        ByteArrayInputStream pdf = pdfExportServiceImplementation.exportUsers();

        HttpHeaders headers = new HttpHeaders();

        headers.add(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=users.pdf"
        );

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));

    }

    //import Excel
    @Operation(
            summary = "Import Users",
            description = "Import users from Excel file"
    )
    @PostMapping("/import")
    public ResponseEntity<ImportResult> importUsers(
            @RequestParam("file") MultipartFile file) {

        if (!ExcelHelper.hasExcelFormat(file)) {

            return ResponseEntity.badRequest().build();

        }

        return ResponseEntity.ok(
                excelService.importExcel(file)
        );

    }

    @PostMapping("/notifications")
    public ResponseEntity<NotificationDto> sendNotification(
            @RequestBody SendNotificationRequest request) {

        return ResponseEntity.ok(
                notificationService.sendNotification(request)
        );
    }

    @PostMapping("/notifications/broadcast")
    public ResponseEntity<String> broadcastNotification(

            @RequestBody BroadcastNotificationRequest request){

        notificationService.sendNotificationToAll(request);

        return ResponseEntity.ok(
                "Notification sent to all users."
        );

    }
    @GetMapping("/audit-logs")
    public ResponseEntity<Page<AuditLogDto>> getAuditLogs(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size

    ) {

        return ResponseEntity.ok(

                auditLogService.getAllLogs(page, size)

        );

    }

    @GetMapping("/audit-logs/search")
    public ResponseEntity<Page<AuditLogDto>> searchAuditLogs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) AuditAction action,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        return ResponseEntity.ok(
                auditLogService.searchAuditLogs(
                        search,
                        action,
                        page,
                        size
                )
        );
    }


}
