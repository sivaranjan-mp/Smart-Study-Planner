package com.studyplanner.taskmanager.dto.request;

/**
 * Task Creation Request DTO.
 * Responsibility: Inbound payload for POST /api/tasks with Jakarta Validation annotations.
 * Fields: taskName, subject, description, priority, deadline, status (optional).
 */
public class TaskCreateRequest {
    // TODO: Define taskName (@NotBlank, @Size(max=150))
    // TODO: Define subject (@NotBlank, @Size(max=100))
    // TODO: Define description (@Size(max=2000), optional)
    // TODO: Define priority (@NotNull)
    // TODO: Define deadline (@NotNull, @Future / @FutureOrPresent)
    // TODO: Define status (optional, defaults to PENDING)
}
