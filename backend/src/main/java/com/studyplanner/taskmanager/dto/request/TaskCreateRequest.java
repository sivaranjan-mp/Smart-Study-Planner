package com.studyplanner.taskmanager.dto.request;

import com.studyplanner.taskmanager.entity.Priority;
import com.studyplanner.taskmanager.entity.Status;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Task Creation Request DTO.
 * Responsibility: Inbound payload for POST /api/tasks with Jakarta Validation annotations.
 * Fields: taskName (@NotBlank, @Size(max=150)), subject (@NotBlank, @Size(max=100)),
 * description (@Size(max=2000), optional), priority (@NotNull), deadline (@NotNull, @FutureOrPresent),
 * status (optional — defaults server-side to PENDING if omitted).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskCreateRequest {

    @NotBlank(message = "Task name is required")
    @Size(max = 150, message = "Task name must not exceed 150 characters")
    private String taskName;

    @NotBlank(message = "Subject is required")
    @Size(max = 100, message = "Subject must not exceed 100 characters")
    private String subject;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @NotNull(message = "Deadline is required")
    @FutureOrPresent(message = "Deadline must be in the present or future")
    private LocalDateTime deadline;

    private Status status;
}
