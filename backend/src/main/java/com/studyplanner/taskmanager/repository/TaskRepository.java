package com.studyplanner.taskmanager.repository;

import com.studyplanner.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Task Spring Data JPA Repository.
 * Responsibility: Declares derived-query methods and JPA specification support for Task entity persistence.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    // TODO: findByStatus(Status status, Pageable pageable)
    // TODO: findByPriority(Priority priority, Pageable pageable)
    // TODO: findByTaskNameContainingIgnoreCaseOrSubjectContainingIgnoreCase(String taskName, String subject, Pageable pageable)
    // TODO: findByDeadlineBetween(LocalDateTime start, LocalDateTime end)
    // TODO: countByStatus(Status status)
}
