package com.example.programming.dto;

import com.example.programming.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendNotificationRequest {

    private Long userId;

    private String title;

    private String message;

    private NotificationType type;

}