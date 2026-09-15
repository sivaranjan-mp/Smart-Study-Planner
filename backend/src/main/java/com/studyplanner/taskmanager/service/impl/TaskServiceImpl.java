package com.studyplanner.taskmanager.service.impl;

import com.studyplanner.taskmanager.dto.request.TaskCreateRequest;
import com.studyplanner.taskmanager.dto.request.TaskFilterRequest;
import com.studyplanner.taskmanager.dto.request.TaskUpdateRequest;
import com.studyplanner.taskmanager.dto.response.DashboardSummaryResponse;
import com.studyplanner.taskmanager.dto.response.PagedResponse;
import com.studyplanner.taskmanager.dto.response.TaskResponse;
import com.studyplanner.taskmanager.entity.Status;
import com.studyplanner.taskmanager.entity.Task;
import com.studyplanner.taskmanager.exception.InvalidRequestException;
import com.studyplanner.taskmanager.exception.ResourceNotFoundException;
import com.studyplanner.taskmanager.mapper.TaskMapper;
import com.studyplanner.taskmanager.repository.TaskRepository;
import com.studyplanner.taskmanager.service.TaskService;
import com.studyplanner.taskmanager.util.SortDirectionResolver;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Task Service Implementation.
 * Responsibility: Owns business logic, validation orchestration, entity lifecycle,
 * repository coordination, and DTO mapping.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    @Override
    @Transactional
    public TaskResponse createTask(TaskCreateRequest request) {
        if (request == null) {
            throw new InvalidRequestException("Task create request cannot be null");
        }

        if (request.getDeadline() != null && request.getDeadline().isBefore(LocalDateTime.now())) {
            throw new InvalidRequestException("Deadline cannot be in the past when creating a task");
        }

        Task task = taskMapper.toEntity(request);
        if (task.getStatus() == null) {
            task.setStatus(Status.PENDING);
        }

        Task savedTask = taskRepository.save(task);
        return taskMapper.toResponse(savedTask);
    }

    @Override
    public PagedResponse<TaskResponse> getAllTasks(Pageable pageable) {
        Pageable effectivePageable = (pageable != null)
                ? pageable
                : PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Task> taskPage = taskRepository.findAll(effectivePageable);
        return buildPagedResponse(taskPage);
    }

    @Override
    public TaskResponse getTaskById(Long id) {
        if (id == null) {
            throw new InvalidRequestException("Task ID must not be null");
        }

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return taskMapper.toResponse(task);
    }

    @Override
    @Transactional
    public TaskResponse updateTask(Long id, TaskUpdateRequest request) {
        if (id == null) {
            throw new InvalidRequestException("Task ID must not be null");
        }
        if (request == null) {
            throw new InvalidRequestException("Task update request cannot be null");
        }

        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        taskMapper.updateEntityFromRequest(existingTask, request);
        Task updatedTask = taskRepository.save(existingTask);
        return taskMapper.toResponse(updatedTask);
    }

    @Override
    @Transactional
    public void deleteTask(Long id) {
        if (id == null) {
            throw new InvalidRequestException("Task ID must not be null");
        }

        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task", "id", id);
        }

        taskRepository.deleteById(id);
    }

    @Override
    public PagedResponse<TaskResponse> searchTasks(String keyword, Pageable pageable) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllTasks(pageable);
        }

        Pageable effectivePageable = (pageable != null)
                ? pageable
                : PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt"));

        String searchKeyword = keyword.trim();
        Page<Task> taskPage = taskRepository.findByTaskNameContainingIgnoreCaseOrSubjectContainingIgnoreCase(
                searchKeyword, searchKeyword, effectivePageable);

        return buildPagedResponse(taskPage);
    }

    @Override
    public PagedResponse<TaskResponse> filterTasks(TaskFilterRequest request) {
        TaskFilterRequest filter = (request != null) ? request : new TaskFilterRequest();

        String sortBy = "deadline".equalsIgnoreCase(filter.getSortBy()) ? "deadline" : "createdAt";
        Sort.Direction direction = SortDirectionResolver.resolve(filter.getSortDirection(), Sort.Direction.DESC);

        int pageNumber = Math.max(0, filter.getPage());
        int pageSize = Math.max(1, filter.getSize());
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(direction, sortBy));

        Specification<Task> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getPriority() != null) {
                predicates.add(criteriaBuilder.equal(root.get("priority"), filter.getPriority()));
            }

            if (filter.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), filter.getStatus()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Task> taskPage = taskRepository.findAll(spec, pageable);
        return buildPagedResponse(taskPage);
    }

    @Override
    public DashboardSummaryResponse getDashboardSummary() {
        long totalTasks = taskRepository.count();
        long completedTasks = taskRepository.countByStatus(Status.COMPLETED);
        long pendingTasks = taskRepository.countByStatus(Status.PENDING);
        long inProgressTasks = taskRepository.countByStatus(Status.IN_PROGRESS);

        double completionPercentage = (totalTasks > 0)
                ? Math.round(((double) completedTasks / totalTasks) * 10000.0) / 100.0
                : 0.0;

        Specification<Task> upcomingSpec = (root, query, criteriaBuilder) -> criteriaBuilder.and(
                root.get("status").in(Status.PENDING, Status.IN_PROGRESS),
                criteriaBuilder.greaterThanOrEqualTo(root.get("deadline"), LocalDateTime.now())
        );

        Pageable topFive = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "deadline"));
        Page<Task> upcomingPage = taskRepository.findAll(upcomingSpec, topFive);
        List<TaskResponse> upcomingDeadlines = taskMapper.toResponseList(upcomingPage.getContent());

        return DashboardSummaryResponse.builder()
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .pendingTasks(pendingTasks)
                .inProgressTasks(inProgressTasks)
                .completionPercentage(completionPercentage)
                .upcomingDeadlines(upcomingDeadlines)
                .build();
    }

    private PagedResponse<TaskResponse> buildPagedResponse(Page<Task> taskPage) {
        return PagedResponse.<TaskResponse>builder()
                .content(taskMapper.toResponseList(taskPage.getContent()))
                .page(taskPage.getNumber())
                .size(taskPage.getSize())
                .totalElements(taskPage.getTotalElements())
                .totalPages(taskPage.getTotalPages())
                .last(taskPage.isLast())
                .build();
    }
}
