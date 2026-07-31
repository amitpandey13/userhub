package com.example.programming.dto;

import com.example.programming.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardResponse {

    private long totalUsers;

    private long activeUsers;

    private long inactiveUsers;

    private long newUsersToday;

    private List<RecentUserDto> recentUsers;

    private List<MonthlyUsersDto> monthlyUsers;

}
