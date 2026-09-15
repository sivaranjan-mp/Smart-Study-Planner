package com.studyplanner.taskmanager.service;

import com.studyplanner.taskmanager.dto.request.TaskCreateRequest;
import com.studyplanner.taskmanager.dto.request.TaskFilterRequest;
import com.studyplanner.taskmanager.dto.request.TaskUpdateRequest;
import com.studyplanner.taskmanager.dto.response.DashboardSummaryResponse;
import com.studyplanner.taskmanager.dto.response.PagedResponse;
import com.studyplanner.taskmanager.dto.response.TaskResponse;
import org.springframework.data.domain.Pageable;

/**
 * Task Service Interface.
 * Responsibility: Declares core business contracts for task operations and dashboard metrics.
 */
public interface TaskService {

    /**
     * Creates a new task.
     *
     * @param request inbound task creation data
     * @return outbound task response data
     */
    TaskResponse createTask(TaskCreateRequest request);

    /**
     * Retrieves all tasks with pagination.
     *
     * @param pageable pagination and sorting parameters
     * @return paginated list of task responses
     */
    PagedResponse<TaskResponse> getAllTasks(Pageable pageable);

    /**
     * Retrieves a task by its unique identifier.
     *
     * @param id task identifier
     * @return task response data
     */
    TaskResponse getTaskById(Long id);

    /**
     * Updates an existing task with full replacement semantics.
     *
     * @param id      task identifier
     * @param request inbound task update data
     * @return updated task response data
     */
    TaskResponse updateTask(Long id, TaskUpdateRequest request);

    /**
     * Deletes a task by its unique identifier.
     *
     * @param id task identifier
     */
    void deleteTask(Long id);

    /**
     * Searches tasks by task name or subject keyword with pagination.
     *
     * @param keyword  search keyword
     * @param pageable pagination and sorting parameters
     * @return paginated list of matching task responses
     */
    PagedResponse<TaskResponse> searchTasks(String keyword, Pageable pageable);

    /**
     * Filters tasks based on dynamic criteria (status, priority, sorting, pagination).
     *
     * @param request filter criteria
     * @return paginated list of filtered task responses
     */
    PagedResponse<TaskResponse> filterTasks(TaskFilterRequest request);

    /**
     * Retrieves dashboard summary metrics and upcoming deadlines.
     *
     * @return dashboard summary response
     */
    DashboardSummaryResponse getDashboardSummary();
}
