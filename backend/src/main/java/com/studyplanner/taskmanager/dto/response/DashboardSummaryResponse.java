package com.studyplanner.taskmanager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Dashboard Summary Aggregates Response DTO.
 * Responsibility: Outbound representation of system aggregates for dashboard metrics.
 * Structure: { totalTasks, completedTasks, pendingTasks, inProgressTasks, completionPercentage, upcomingDeadlines: List<TaskResponse> }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryResponse {

    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private double completionPercentage;
    private List<TaskResponse> upcomingDeadlines;
}
