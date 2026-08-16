package com.example.programming.services;

import com.example.programming.entities.User;
import com.example.programming.Repositories.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InactiveUserService {

    private final UserRepo userRepo;
    private final EmailService emailService;
    @Scheduled(cron = "0 0 10 * * *", zone = "Asia/Kolkata")
    public void checkInactiveUsers() {

        System.out.println("🔥 SCHEDULER IS RUNNING: "
                + LocalDateTime.now());

        LocalDateTime cutoff =
                LocalDateTime.now().minusDays(5);

        List<User> inactiveUsers =
                userRepo.findByLastLoginBefore(cutoff);

        System.out.println(
                "Inactive users found: "
                        + inactiveUsers.size()
        );
        for (User user : inactiveUsers) {

            System.out.println(
                    "Sending email to: " + user.getEmail()
            );

            emailService.sendInactiveUserEmail(
                    user.getEmail(),
                    user.getName()
            );
        }

    }
}