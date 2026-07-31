package com.example.programming.entities;

import com.example.programming.enums.AuditAction;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Admin/User who performed the action
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by")
    private User performedBy;

    // Optional user who was affected
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_user")
    private User targetUser;

    @Enumerated(EnumType.STRING)
    private AuditAction action;

    @Column(length = 1000)
    private String description;

    private String ipAddress;

    private LocalDateTime createdAt;

}