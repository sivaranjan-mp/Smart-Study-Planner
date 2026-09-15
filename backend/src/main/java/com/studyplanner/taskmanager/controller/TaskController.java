package com.studyplanner.taskmanager.controller;

import com.studyplanner.taskmanager.dto.request.TaskCreateRequest;
import com.studyplanner.taskmanager.dto.request.TaskFilterRequest;
import com.studyplanner.taskmanager.dto.request.TaskUpdateRequest;
import com.studyplanner.taskmanager.dto.response.ApiResponse;
import com.studyplanner.taskmanager.dto.response.PagedResponse;
import com.studyplanner.taskmanager.dto.response.TaskResponse;
import com.studyplanner.taskmanager.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Task REST Controller.
 * Responsibility: Exposes REST API endpoints for /api/tasks per Section 4.3 and Section 12.
 * Thin layer: binds/validates requests (@Valid), delegates to TaskService, wraps in ApiResponse.
 */
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Task Management CRUD and Search/Filter Operations")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @Operation(summary = "Create a new task")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(@Valid @RequestBody TaskCreateRequest request) {
        TaskResponse response = taskService.createTask(request);
        return new ResponseEntity<>(ApiResponse.success("Task created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all tasks with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<TaskResponse>>> getAllTasks(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PagedResponse<TaskResponse> response = taskService.getAllTasks(pageable);
        return ResponseEntity.ok(ApiResponse.success("Tasks retrieved successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable("id") Long id) {
        TaskResponse response = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success("Task retrieved successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing task (full replacement)")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable("id") Long id,
            @Valid @RequestBody TaskUpdateRequest request) {
        TaskResponse response = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task by ID")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable("id") Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }

    @GetMapping("/search")
    @Operation(summary = "Search tasks by name or subject keyword")
    public ResponseEntity<ApiResponse<PagedResponse<TaskResponse>>> searchTasks(
            @RequestParam(name = "keyword", required = false) String keyword,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PagedResponse<TaskResponse> response = taskService.searchTasks(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success("Task search results retrieved successfully", response));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter tasks by priority, status, sorting, and pagination")
    public ResponseEntity<ApiResponse<PagedResponse<TaskResponse>>> filterTasks(
            TaskFilterRequest filterRequest) {
        PagedResponse<TaskResponse> response = taskService.filterTasks(filterRequest);
        return ResponseEntity.ok(ApiResponse.success("Filtered tasks retrieved successfully", response));
    }
}
