package com.example.programming.dto;

import com.example.programming.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BroadcastNotificationRequest {

    private String title;

    private String message;

    private NotificationType type;

}