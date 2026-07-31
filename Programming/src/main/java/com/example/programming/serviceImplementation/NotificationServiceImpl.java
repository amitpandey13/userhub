package com.example.programming.serviceImplementation;

import com.example.programming.Repositories.NotificationRepository;
import com.example.programming.Repositories.UserRepo;
import com.example.programming.dto.BroadcastNotificationRequest;
import com.example.programming.dto.NotificationDto;
import com.example.programming.dto.SendNotificationRequest;
import com.example.programming.entities.Notification;
import com.example.programming.entities.User;
import com.example.programming.enums.AuditAction;
import com.example.programming.exception.UserNotFoundException;
import com.example.programming.services.AuditLogService;
import com.example.programming.services.NotificationService;
import com.example.programming.utils.SecurityUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final UserRepo userRepo;
    private final NotificationRepository notificationRepository;
    private final SecurityUtil securityUtil;
    private final AuditLogService auditLogService;
    public NotificationServiceImpl(UserRepo userRepo, NotificationRepository notificationRepository, SecurityUtil securityUtil, AuditLogService auditLogService) {
        this.userRepo = userRepo;
        this.notificationRepository = notificationRepository;
        this.securityUtil = securityUtil;
        this.auditLogService = auditLogService;
    }

    @Override
    public NotificationDto sendNotification(
            SendNotificationRequest request) {

        User user = userRepo.findById(Math.toIntExact(request.getUserId()))
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Notification notification =
                Notification.builder()
                        .user(user)
                        .title(request.getTitle())
                        .message(request.getMessage())
                        .type(request.getType())
                        .isRead(false)
                        .createdAt(LocalDateTime.now())
                        .build();

        notificationRepository.save(notification);
        auditLogService.log(

                securityUtil.getCurrentUser(),

                user,

                AuditAction.NOTIFICATION_SENT,

                "Sent notification to " + user.getName(),

                null

        );

        return NotificationDto.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    @Override
    public List<NotificationDto> getCurrentUserNotifications() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));
        auditLogService.log(

                securityUtil.getCurrentUser(),

                null,

                AuditAction.BROADCAST_NOTIFICATION,

                "Get current user notification "
                        + user,


                null

        );

        return notificationRepository
                .findByUser_UserIdOrderByCreatedAtDesc(
                        user.getUserId()
                )
                .stream()
                .map(notification -> NotificationDto.builder()
                        .id(notification.getId())
                        .title(notification.getTitle())
                        .message(notification.getMessage())
                        .type(notification.getType())
                        .isRead(notification.isRead())
                        .createdAt(notification.getCreatedAt())
                        .build())
                .toList();
    }

    @Override
    public NotificationDto markAsRead(int notificationId) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));

        notification.setRead(true);

        notificationRepository.save(notification);

        return NotificationDto.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    @Override
    public void markAllAsRead() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        List<Notification> notifications =
                notificationRepository
                        .findByUser_UserIdAndIsReadFalse(
                                user.getUserId()
                        );

        notifications.forEach(notification ->
                notification.setRead(true));

        notificationRepository.saveAll(notifications);
    }

    @Override
    public void deleteNotification(int notificationId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));

        // User can delete only his own notification
        if (notification.getUser().getUserId() != user.getUserId()) {
            throw new RuntimeException("You are not authorized to delete this notification.");
        }

        notificationRepository.delete(notification);
    }

    @Override
    public void sendNotificationToAll(
            BroadcastNotificationRequest request) {

        List<User> users = userRepo.findAll();

        List<Notification> notifications = new ArrayList<>();

        for(User user : users){

            Notification notification =
                    Notification.builder()
                            .user(user)
                            .title(request.getTitle())
                            .message(request.getMessage())
                            .type(request.getType())
                            .isRead(false)
                            .createdAt(LocalDateTime.now())
                            .build();

            notifications.add(notification);

        }

        notificationRepository.saveAll(notifications);
        auditLogService.log(

                securityUtil.getCurrentUser(),

                null,

                AuditAction.BROADCAST_NOTIFICATION,

                "Broadcast notification sent to "
                        + notifications.size()
                        + " users.",

                null

        );

    }
}
