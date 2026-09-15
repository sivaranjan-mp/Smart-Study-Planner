package com.studyplanner.taskmanager.dto.request;

import com.studyplanner.taskmanager.entity.Priority;
import com.studyplanner.taskmanager.entity.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Task Update Request DTO.
 * Responsibility: Inbound payload for PUT /api/tasks/{id} with full-replace update semantics.
 * Fields: taskName (@NotBlank, @Size(max=150)), subject (@NotBlank, @Size(max=100)),
 * description (@Size(max=2000), optional), priority (@NotNull), deadline (@NotNull), status (@NotNull).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskUpdateRequest {

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
    private LocalDateTime deadline;

    @NotNull(message = "Status is required")
    private Status status;
}
