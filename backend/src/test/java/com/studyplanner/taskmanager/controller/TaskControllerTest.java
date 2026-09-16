package com.studyplanner.taskmanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studyplanner.taskmanager.dto.request.TaskCreateRequest;
import com.studyplanner.taskmanager.dto.request.TaskUpdateRequest;
import com.studyplanner.taskmanager.dto.response.DashboardSummaryResponse;
import com.studyplanner.taskmanager.dto.response.PagedResponse;
import com.studyplanner.taskmanager.dto.response.TaskResponse;
import com.studyplanner.taskmanager.entity.Priority;
import com.studyplanner.taskmanager.entity.Status;
import com.studyplanner.taskmanager.exception.GlobalExceptionHandler;
import com.studyplanner.taskmanager.exception.ResourceNotFoundException;
import com.studyplanner.taskmanager.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * TaskController WebMvc Unit/Integration Test.
 * Responsibility: Tests REST endpoints, HTTP status codes, request validation, and response envelopes.
 */
@WebMvcTest(controllers = {TaskController.class, DashboardController.class})
@Import(GlobalExceptionHandler.class)
public class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TaskService taskService;

    private TaskResponse sampleResponse;
    private TaskCreateRequest validCreateRequest;
    private TaskUpdateRequest validUpdateRequest;

    @BeforeEach
    void setUp() {
        sampleResponse = TaskResponse.builder()
                .id(1L)
                .taskName("Biology Exam Prep")
                .subject("Biology")
                .description("Cellular respiration and photosynthesis")
                .priority(Priority.HIGH)
                .deadline(LocalDateTime.now().plusDays(2))
                .status(Status.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        validCreateRequest = TaskCreateRequest.builder()
                .taskName("Biology Exam Prep")
                .subject("Biology")
                .description("Cellular respiration and photosynthesis")
                .priority(Priority.HIGH)
                .deadline(LocalDateTime.now().plusDays(2))
                .status(Status.PENDING)
                .build();

        validUpdateRequest = TaskUpdateRequest.builder()
                .taskName("Biology Exam Prep (Revised)")
                .subject("Biology")
                .description("Genetics and heredity")
                .priority(Priority.MEDIUM)
                .deadline(LocalDateTime.now().plusDays(3))
                .status(Status.IN_PROGRESS)
                .build();
    }

    @Test
    @DisplayName("POST /api/tasks: returns 201 Created on valid input")
    void testCreateTask_Success_201Created() throws Exception {
        when(taskService.createTask(any(TaskCreateRequest.class))).thenReturn(sampleResponse);

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validCreateRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1L))
                .andExpect(jsonPath("$.data.taskName").value("Biology Exam Prep"))
                .andExpect(jsonPath("$.data.priority").value("HIGH"));
    }

    @Test
    @DisplayName("POST /api/tasks: returns 400 Bad Request on invalid payload")
    void testCreateTask_ValidationFailure_400BadRequest() throws Exception {
        TaskCreateRequest invalidRequest = TaskCreateRequest.builder()
                .taskName("") // Blank taskName
                .subject(null) // Null subject
                .priority(null)
                .build();

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.details").isArray());
    }

    @Test
    @DisplayName("GET /api/tasks: returns 200 OK with paginated response")
    void testGetAllTasks_200OK() throws Exception {
        PagedResponse<TaskResponse> pagedResponse = PagedResponse.<TaskResponse>builder()
                .content(List.of(sampleResponse))
                .page(0)
                .size(10)
                .totalElements(1)
                .totalPages(1)
                .last(true)
                .build();

        when(taskService.getAllTasks(any())).thenReturn(pagedResponse);

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }

    @Test
    @DisplayName("GET /api/tasks/{id}: returns 200 OK when task exists")
    void testGetTaskById_Success_200OK() throws Exception {
        when(taskService.getTaskById(1L)).thenReturn(sampleResponse);

        mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1L));
    }

    @Test
    @DisplayName("GET /api/tasks/{id}: returns 404 Not Found when task does not exist")
    void testGetTaskById_NotFound_404NotFound() throws Exception {
        when(taskService.getTaskById(999L)).thenThrow(new ResourceNotFoundException("Task", "id", 999L));

        mockMvc.perform(get("/api/tasks/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("RESOURCE_NOT_FOUND"));
    }

    @Test
    @DisplayName("PUT /api/tasks/{id}: returns 200 OK on valid update")
    void testUpdateTask_Success_200OK() throws Exception {
        when(taskService.updateTask(eq(1L), any(TaskUpdateRequest.class))).thenReturn(sampleResponse);

        mockMvc.perform(put("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validUpdateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1L));
    }

    @Test
    @DisplayName("PUT /api/tasks/{id}: returns 400 Bad Request on invalid fields")
    void testUpdateTask_ValidationFailure_400BadRequest() throws Exception {
        TaskUpdateRequest invalidRequest = TaskUpdateRequest.builder()
                .taskName("")
                .build();

        mockMvc.perform(put("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"));
    }

    @Test
    @DisplayName("DELETE /api/tasks/{id}: returns 200 OK on successful deletion")
    void testDeleteTask_Success_200OK() throws Exception {
        doNothing().when(taskService).deleteTask(1L);

        mockMvc.perform(delete("/api/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("DELETE /api/tasks/{id}: returns 404 Not Found when task does not exist")
    void testDeleteTask_NotFound_404NotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Task", "id", 999L)).when(taskService).deleteTask(999L);

        mockMvc.perform(delete("/api/tasks/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("RESOURCE_NOT_FOUND"));
    }

    @Test
    @DisplayName("GET /api/tasks/search: returns 200 OK with matching results")
    void testSearchTasks_200OK() throws Exception {
        PagedResponse<TaskResponse> pagedResponse = PagedResponse.<TaskResponse>builder()
                .content(List.of(sampleResponse))
                .page(0)
                .size(10)
                .totalElements(1)
                .totalPages(1)
                .last(true)
                .build();

        when(taskService.searchTasks(eq("Biology"), any())).thenReturn(pagedResponse);

        mockMvc.perform(get("/api/tasks/search?keyword=Biology"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    @DisplayName("GET /api/tasks/filter: returns 200 OK with filtered results")
    void testFilterTasks_200OK() throws Exception {
        PagedResponse<TaskResponse> pagedResponse = PagedResponse.<TaskResponse>builder()
                .content(List.of(sampleResponse))
                .page(0)
                .size(10)
                .totalElements(1)
                .totalPages(1)
                .last(true)
                .build();

        when(taskService.filterTasks(any())).thenReturn(pagedResponse);

        mockMvc.perform(get("/api/tasks/filter?priority=HIGH&status=PENDING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    @DisplayName("GET /api/dashboard/summary: returns 200 OK with metrics")
    void testGetDashboardSummary_200OK() throws Exception {
        DashboardSummaryResponse summaryResponse = DashboardSummaryResponse.builder()
                .totalTasks(5L)
                .completedTasks(2L)
                .pendingTasks(2L)
                .inProgressTasks(1L)
                .completionPercentage(40.0)
                .upcomingDeadlines(List.of(sampleResponse))
                .build();

        when(taskService.getDashboardSummary()).thenReturn(summaryResponse);

        mockMvc.perform(get("/api/dashboard/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalTasks").value(5L))
                .andExpect(jsonPath("$.data.completionPercentage").value(40.0));
    }
}
