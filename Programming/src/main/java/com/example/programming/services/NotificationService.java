package com.example.programming.services;

import com.example.programming.dto.AuditLogDto;
import com.example.programming.dto.BroadcastNotificationRequest;
import com.example.programming.dto.NotificationDto;
import com.example.programming.dto.SendNotificationRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface NotificationService {
    NotificationDto sendNotification(SendNotificationRequest request);

    List<NotificationDto> getCurrentUserNotifications();
//
    NotificationDto markAsRead(int notificationId);
    void markAllAsRead();
//
    void deleteNotification(int notificationId);

    void sendNotificationToAll(BroadcastNotificationRequest request);

}
