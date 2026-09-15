package com.studyplanner.taskmanager.mapper;

import com.studyplanner.taskmanager.dto.request.TaskCreateRequest;
import com.studyplanner.taskmanager.dto.request.TaskUpdateRequest;
import com.studyplanner.taskmanager.dto.response.TaskResponse;
import com.studyplanner.taskmanager.entity.Priority;
import com.studyplanner.taskmanager.entity.Status;
import com.studyplanner.taskmanager.entity.Task;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Task Entity / DTO Mapper.
 * Responsibility: Pure conversion component between Task entities and request/response DTOs.
 */
@Component
public class TaskMapper {

    /**
     * Converts a TaskCreateRequest DTO to a Task entity.
     *
     * @param request the create request DTO
     * @return the mapped Task entity, or null if request is null
     */
    public Task toEntity(TaskCreateRequest request) {
        if (request == null) {
            return null;
        }

        return Task.builder()
                .taskName(request.getTaskName())
                .subject(request.getSubject())
                .description(request.getDescription())
                .priority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM)
                .deadline(request.getDeadline())
                .status(request.getStatus() != null ? request.getStatus() : Status.PENDING)
                .build();
    }

    /**
     * Updates an existing Task entity in-place from a TaskUpdateRequest DTO.
     *
     * @param entity  the Task entity to update
     * @param request the update request DTO
     */
    public void updateEntityFromRequest(Task entity, TaskUpdateRequest request) {
        if (entity == null || request == null) {
            return;
        }

        entity.setTaskName(request.getTaskName());
        entity.setSubject(request.getSubject());
        entity.setDescription(request.getDescription());
        entity.setPriority(request.getPriority());
        entity.setDeadline(request.getDeadline());
        entity.setStatus(request.getStatus());
    }

    /**
     * Converts a Task entity to an outbound TaskResponse DTO.
     *
     * @param entity the Task entity
     * @return the mapped TaskResponse DTO, or null if entity is null
     */
    public TaskResponse toResponse(Task entity) {
        if (entity == null) {
            return null;
        }

        return TaskResponse.builder()
                .id(entity.getId())
                .taskName(entity.getTaskName())
                .subject(entity.getSubject())
                .description(entity.getDescription())
                .priority(entity.getPriority())
                .deadline(entity.getDeadline())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    /**
     * Converts a list of Task entities to a list of TaskResponse DTOs.
     *
     * @param entities the list of Task entities
     * @return a list of mapped TaskResponse DTOs, or an empty list if entities is null
     */
    public List<TaskResponse> toResponseList(List<Task> entities) {
        if (entities == null) {
            return Collections.emptyList();
        }

        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
