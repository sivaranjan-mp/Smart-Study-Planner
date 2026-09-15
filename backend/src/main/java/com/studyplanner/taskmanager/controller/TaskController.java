package com.studyplanner.taskmanager.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Task REST Controller.
 * Responsibility: Exposes REST API endpoints for /api/tasks and /api/dashboard per Section 4.3.
 * Thin layer: binds/validates requests (@Valid), delegates to TaskService, wraps in ApiResponse.
 */
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    // TODO: Inject TaskService
    // TODO: POST /api/tasks -> createTask(@Valid @RequestBody TaskCreateRequest request) -> 201 Created
    // TODO: GET /api/tasks -> getAllTasks(Pageable pageable) -> 200 OK
    // TODO: GET /api/tasks/{id} -> getTaskById(@PathVariable Long id) -> 200 OK
    // TODO: PUT /api/tasks/{id} -> updateTask(@PathVariable Long id, @Valid @RequestBody TaskUpdateRequest request) -> 200 OK
    // TODO: DELETE /api/tasks/{id} -> deleteTask(@PathVariable Long id) -> 200/204
    // TODO: GET /api/tasks/search -> searchTasks(@RequestParam String keyword, Pageable pageable) -> 200 OK
    // TODO: GET /api/tasks/filter -> filterTasks(TaskFilterRequest filterRequest) -> 200 OK
}
