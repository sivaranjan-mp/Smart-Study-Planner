package com.studyplanner.taskmanager.repository;

import com.studyplanner.taskmanager.entity.Priority;
import com.studyplanner.taskmanager.entity.Status;
import com.studyplanner.taskmanager.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Task Spring Data JPA Repository.
 * Responsibility: Declares derived-query methods and JPA specification support for Task entity persistence.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    /**
     * Find tasks by status with pagination.
     */
    Page<Task> findByStatus(Status status, Pageable pageable);

    /**
     * Find all tasks by status.
     */
    List<Task> findByStatus(Status status);

    /**
     * Find tasks by priority with pagination.
     */
    Page<Task> findByPriority(Priority priority, Pageable pageable);

    /**
     * Find all tasks by priority.
     */
    List<Task> findByPriority(Priority priority);

    /**
     * Search tasks by task name or subject containing keyword (case-insensitive) with pagination.
     */
    Page<Task> findByTaskNameContainingIgnoreCaseOrSubjectContainingIgnoreCase(String taskName, String subject, Pageable pageable);

    /**
     * Search tasks by task name or subject containing keyword (case-insensitive).
     */
    List<Task> findByTaskNameContainingIgnoreCaseOrSubjectContainingIgnoreCase(String taskName, String subject);

    /**
     * Find tasks with deadline between specified start and end timestamps.
     */
    List<Task> findByDeadlineBetween(LocalDateTime start, LocalDateTime end);

    /**
     * Count tasks matching the given status.
     */
    long countByStatus(Status status);
}
