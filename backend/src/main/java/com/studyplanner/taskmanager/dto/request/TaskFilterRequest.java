package com.studyplanner.taskmanager.dto.request;

import com.studyplanner.taskmanager.entity.Priority;
import com.studyplanner.taskmanager.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Task Filter and Pagination Query Parameters DTO.
 * Responsibility: Bound from query params for GET /api/tasks/filter.
 * Fields: priority (optional), status (optional), sortBy (deadline|createdAt),
 * sortDirection (asc|desc), page, size.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskFilterRequest {

    private Priority priority;

    private Status status;

    @Builder.Default
    private String sortBy = "createdAt";

    @Builder.Default
    private String sortDirection = "desc";

    @Builder.Default
    private int page = 0;

    @Builder.Default
    private int size = 10;
}
