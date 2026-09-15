package com.studyplanner.taskmanager.controller;

import com.studyplanner.taskmanager.dto.response.ApiResponse;
import com.studyplanner.taskmanager.dto.response.DashboardSummaryResponse;
import com.studyplanner.taskmanager.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Dashboard REST Controller.
 * Responsibility: Exposes REST API endpoints for dashboard aggregates and metrics per Section 4.3 and Section 12.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard Analytics and Summary Operations")
public class DashboardController {

    private final TaskService taskService;

    @GetMapping("/summary")
    @Operation(summary = "Get dashboard summary metrics and upcoming deadlines")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getDashboardSummary() {
        DashboardSummaryResponse response = taskService.getDashboardSummary();
        return ResponseEntity.ok(ApiResponse.success("Dashboard summary retrieved successfully", response));
    }
}
