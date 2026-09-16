package com.studyplanner.taskmanager.service;

import com.studyplanner.taskmanager.dto.request.TaskCreateRequest;
import com.studyplanner.taskmanager.dto.request.TaskFilterRequest;
import com.studyplanner.taskmanager.dto.request.TaskUpdateRequest;
import com.studyplanner.taskmanager.dto.response.DashboardSummaryResponse;
import com.studyplanner.taskmanager.dto.response.PagedResponse;
import com.studyplanner.taskmanager.dto.response.TaskResponse;
import com.studyplanner.taskmanager.entity.Priority;
import com.studyplanner.taskmanager.entity.Status;
import com.studyplanner.taskmanager.entity.Task;
import com.studyplanner.taskmanager.exception.InvalidRequestException;
import com.studyplanner.taskmanager.exception.ResourceNotFoundException;
import com.studyplanner.taskmanager.mapper.TaskMapper;
import com.studyplanner.taskmanager.repository.TaskRepository;
import com.studyplanner.taskmanager.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * TaskServiceImpl Mockito Unit Test.
 * Responsibility: Tests business rules, validation logic, entity transformations, and exception throwing.
 */
@ExtendWith(MockitoExtension.class)
public class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private TaskMapper taskMapper;

    @InjectMocks
    private TaskServiceImpl taskService;

    private Task sampleTask;
    private TaskResponse sampleResponse;
    private TaskCreateRequest createRequest;
    private TaskUpdateRequest updateRequest;

    @BeforeEach
    void setUp() {
        sampleTask = Task.builder()
                .id(1L)
                .taskName("Study Operating Systems")
                .subject("Computer Science")
                .description("Processes and threads chapter")
                .priority(Priority.HIGH)
                .deadline(LocalDateTime.now().plusDays(3))
                .status(Status.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        sampleResponse = TaskResponse.builder()
                .id(1L)
                .taskName("Study Operating Systems")
                .subject("Computer Science")
                .description("Processes and threads chapter")
                .priority(Priority.HIGH)
                .deadline(sampleTask.getDeadline())
                .status(Status.PENDING)
                .createdAt(sampleTask.getCreatedAt())
                .updatedAt(sampleTask.getUpdatedAt())
                .build();

        createRequest = TaskCreateRequest.builder()
                .taskName("Study Operating Systems")
                .subject("Computer Science")
                .description("Processes and threads chapter")
                .priority(Priority.HIGH)
                .deadline(LocalDateTime.now().plusDays(3))
                .status(Status.PENDING)
                .build();

        updateRequest = TaskUpdateRequest.builder()
                .taskName("Study Operating Systems (Updated)")
                .subject("Computer Science")
                .description("Memory management chapter")
                .priority(Priority.MEDIUM)
                .deadline(LocalDateTime.now().plusDays(4))
                .status(Status.IN_PROGRESS)
                .build();
    }

    @Test
    @DisplayName("createTask: successfully creates and returns TaskResponse")
    void testCreateTask_Success() {
        when(taskMapper.toEntity(createRequest)).thenReturn(sampleTask);
        when(taskRepository.save(sampleTask)).thenReturn(sampleTask);
        when(taskMapper.toResponse(sampleTask)).thenReturn(sampleResponse);

        TaskResponse result = taskService.createTask(createRequest);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTaskName()).isEqualTo("Study Operating Systems");
        verify(taskRepository).save(sampleTask);
    }

    @Test
    @DisplayName("createTask: throws InvalidRequestException for null request")
    void testCreateTask_NullRequest_ThrowsException() {
        assertThatThrownBy(() -> taskService.createTask(null))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessageContaining("cannot be null");

        verify(taskRepository, never()).save(any());
    }

    @Test
    @DisplayName("createTask: throws InvalidRequestException for past deadline")
    void testCreateTask_PastDeadline_ThrowsException() {
        TaskCreateRequest pastRequest = TaskCreateRequest.builder()
                .taskName("Past Task")
                .subject("History")
                .priority(Priority.LOW)
                .deadline(LocalDateTime.now().minusDays(1))
                .build();

        assertThatThrownBy(() -> taskService.createTask(pastRequest))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessageContaining("past");

        verify(taskRepository, never()).save(any());
    }

    @Test
    @DisplayName("getAllTasks: returns paginated response")
    void testGetAllTasks_Success() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Task> taskPage = new PageImpl<>(List.of(sampleTask), pageable, 1);

        when(taskRepository.findAll(pageable)).thenReturn(taskPage);
        when(taskMapper.toResponseList(taskPage.getContent())).thenReturn(List.of(sampleResponse));

        PagedResponse<TaskResponse> result = taskService.getAllTasks(pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getPage()).isEqualTo(0);
    }

    @Test
    @DisplayName("getTaskById: returns TaskResponse when found")
    void testGetTaskById_Success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskMapper.toResponse(sampleTask)).thenReturn(sampleResponse);

        TaskResponse result = taskService.getTaskById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("getTaskById: throws ResourceNotFoundException when not found")
    void testGetTaskById_NotFound_ThrowsException() {
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTaskById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("999");
    }

    @Test
    @DisplayName("getTaskById: throws InvalidRequestException for null ID")
    void testGetTaskById_NullId_ThrowsException() {
        assertThatThrownBy(() -> taskService.getTaskById(null))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessageContaining("Task ID must not be null");
    }

    @Test
    @DisplayName("updateTask: modifies and returns updated TaskResponse")
    void testUpdateTask_Success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(sampleTask)).thenReturn(sampleTask);
        when(taskMapper.toResponse(sampleTask)).thenReturn(sampleResponse);

        TaskResponse result = taskService.updateTask(1L, updateRequest);

        assertThat(result).isNotNull();
        verify(taskMapper).updateEntityFromRequest(sampleTask, updateRequest);
        verify(taskRepository).save(sampleTask);
    }

    @Test
    @DisplayName("updateTask: throws ResourceNotFoundException when task does not exist")
    void testUpdateTask_NotFound_ThrowsException() {
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.updateTask(999L, updateRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("999");

        verify(taskRepository, never()).save(any());
    }

    @Test
    @DisplayName("deleteTask: removes task when found")
    void testDeleteTask_Success() {
        when(taskRepository.existsById(1L)).thenReturn(true);

        taskService.deleteTask(1L);

        verify(taskRepository).deleteById(1L);
    }

    @Test
    @DisplayName("deleteTask: throws ResourceNotFoundException when task not found")
    void testDeleteTask_NotFound_ThrowsException() {
        when(taskRepository.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> taskService.deleteTask(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("999");

        verify(taskRepository, never()).deleteById(any());
    }

    @Test
    @DisplayName("searchTasks: searches by keyword in name or subject")
    void testSearchTasks_WithKeyword() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Task> taskPage = new PageImpl<>(List.of(sampleTask), pageable, 1);

        when(taskRepository.findByTaskNameContainingIgnoreCaseOrSubjectContainingIgnoreCase(eq("Computer"), eq("Computer"), any(Pageable.class)))
                .thenReturn(taskPage);
        when(taskMapper.toResponseList(taskPage.getContent())).thenReturn(List.of(sampleResponse));

        PagedResponse<TaskResponse> result = taskService.searchTasks("Computer", pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    @DisplayName("searchTasks: with empty keyword delegates to getAllTasks")
    void testSearchTasks_EmptyKeyword_DelegatesToGetAll() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Task> taskPage = new PageImpl<>(List.of(sampleTask), pageable, 1);

        when(taskRepository.findAll(any(Pageable.class))).thenReturn(taskPage);
        when(taskMapper.toResponseList(taskPage.getContent())).thenReturn(List.of(sampleResponse));

        PagedResponse<TaskResponse> result = taskService.searchTasks("   ", pageable);

        assertThat(result).isNotNull();
        verify(taskRepository).findAll(any(Pageable.class));
    }

    @Test
    @DisplayName("filterTasks: applies specification and returns paged response")
    void testFilterTasks_Success() {
        TaskFilterRequest filterRequest = TaskFilterRequest.builder()
                .priority(Priority.HIGH)
                .status(Status.PENDING)
                .sortBy("deadline")
                .sortDirection("asc")
                .page(0)
                .size(10)
                .build();

        Page<Task> taskPage = new PageImpl<>(List.of(sampleTask));
        when(taskRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(taskPage);
        when(taskMapper.toResponseList(taskPage.getContent())).thenReturn(List.of(sampleResponse));

        PagedResponse<TaskResponse> result = taskService.filterTasks(filterRequest);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    @DisplayName("getDashboardSummary: aggregates counts, percentage, and upcoming deadlines")
    void testGetDashboardSummary_Success() {
        when(taskRepository.count()).thenReturn(10L);
        when(taskRepository.countByStatus(Status.COMPLETED)).thenReturn(6L);
        when(taskRepository.countByStatus(Status.PENDING)).thenReturn(3L);
        when(taskRepository.countByStatus(Status.IN_PROGRESS)).thenReturn(1L);

        Page<Task> upcomingPage = new PageImpl<>(List.of(sampleTask));
        when(taskRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(upcomingPage);
        when(taskMapper.toResponseList(upcomingPage.getContent())).thenReturn(List.of(sampleResponse));

        DashboardSummaryResponse result = taskService.getDashboardSummary();

        assertThat(result).isNotNull();
        assertThat(result.getTotalTasks()).isEqualTo(10L);
        assertThat(result.getCompletedTasks()).isEqualTo(6L);
        assertThat(result.getPendingTasks()).isEqualTo(3L);
        assertThat(result.getInProgressTasks()).isEqualTo(1L);
        assertThat(result.getCompletionPercentage()).isEqualTo(60.0);
        assertThat(result.getUpcomingDeadlines()).hasSize(1);
    }
}
