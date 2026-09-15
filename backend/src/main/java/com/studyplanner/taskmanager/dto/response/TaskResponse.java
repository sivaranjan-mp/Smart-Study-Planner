package com.studyplanner.taskmanager.dto.response;

import com.studyplanner.taskmanager.entity.Priority;
import com.studyplanner.taskmanager.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Task Response DTO.
 * Responsibility: Outbound representation of a Task entity to avoid exposing JPA entities directly.
 * Fields: id, taskName, subject, description, priority, deadline, status, createdAt, updatedAt.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {

    private Long id;
    private String taskName;
    private String subject;
    private String description;
    private Priority priority;
    private LocalDateTime deadline;
    private Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
