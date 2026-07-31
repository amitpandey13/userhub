package com.example.programming.serviceImplementation;


import com.example.programming.Repositories.UserRepo;
import com.example.programming.dto.DashboardResponse;
import com.example.programming.dto.MonthlyUsersDto;
import com.example.programming.dto.RecentUserDto;
import com.example.programming.enums.UserStatus;
import com.example.programming.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class DashboardServiceImplementation implements DashboardService {

    private final UserRepo userRepository;

    @Override
    public DashboardResponse getDashboard() {

        List<RecentUserDto> recentUsers =
                userRepository.findTop5ByOrderByCreatedAtDesc()
                        .stream()
                        .map(user -> RecentUserDto.builder()
                                .id((long) user.getUserId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .status(user.getStatus())
                                .build())
                        .toList();

        // 👇 Monthly Users starts here

        List<Object[]> monthlyUsers = userRepository.getMonthlyUsers();

        List<MonthlyUsersDto> monthlyUsersDto = new ArrayList<>();

        for (Object[] row : monthlyUsers) {

            Integer monthNumber = (Integer) row[0];

            Long users = (Long) row[1];

            String month = Month.of(monthNumber)
                    .getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            MonthlyUsersDto dto = MonthlyUsersDto.builder()
                    .month(month)
                    .users(users)
                    .build();

            monthlyUsersDto.add(dto);
        }

// We'll add this in the next step
// dashboard.setMonthlyUsers(monthlyUsersDto);

        return DashboardResponse.builder()
                .totalUsers(userRepository.count())
                .activeUsers(userRepository.countByStatus(UserStatus.ACTIVE))
                .inactiveUsers(userRepository.countByStatus(UserStatus.INACTIVE))
                .newUsersToday(
                        userRepository.countByCreatedAtAfter(
                                LocalDate.now().atStartOfDay()
                        )
                )
                .recentUsers(recentUsers)
                .monthlyUsers(monthlyUsersDto)
                .build();
    }



}
