package com.studyplanner.taskmanager.repository;

import com.studyplanner.taskmanager.entity.Priority;
import com.studyplanner.taskmanager.entity.Status;
import com.studyplanner.taskmanager.entity.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * TaskRepository DataJpaTest.
 * Responsibility: Tests derived queries, persistence operations, and counting.
 */
@DataJpaTest
public class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TestEntityManager entityManager;

    private Task sampleTask1;
    private Task sampleTask2;
    private Task sampleTask3;

    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();

        sampleTask1 = Task.builder()
                .taskName("Complete Math Assignment")
                .subject("Mathematics")
                .description("Calculus chapter 4 exercises")
                .priority(Priority.HIGH)
                .deadline(LocalDateTime.now().plusDays(2))
                .status(Status.PENDING)
                .build();

        sampleTask2 = Task.builder()
                .taskName("Read History Chapter")
                .subject("History")
                .description("World War II overview")
                .priority(Priority.MEDIUM)
                .deadline(LocalDateTime.now().plusDays(5))
                .status(Status.IN_PROGRESS)
                .build();

        sampleTask3 = Task.builder()
                .taskName("Physics Lab Report")
                .subject("Physics")
                .description("Optics experiment results")
                .priority(Priority.LOW)
                .deadline(LocalDateTime.now().plusDays(10))
                .status(Status.COMPLETED)
                .build();

        entityManager.persist(sampleTask1);
        entityManager.persist(sampleTask2);
        entityManager.persist(sampleTask3);
        entityManager.flush();
    }

    @Test
    @DisplayName("Should save task and find by ID with auto-populated timestamps")
    void testSaveAndFindById() {
        Task newTask = Task.builder()
                .taskName("Chemistry Experiment")
                .subject("Chemistry")
                .description("Titration experiment")
                .priority(Priority.HIGH)
                .deadline(LocalDateTime.now().plusDays(3))
                .status(Status.PENDING)
                .build();

        Task saved = taskRepository.save(newTask);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getUpdatedAt()).isNotNull();

        Optional<Task> found = taskRepository.findById(saved.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getTaskName()).isEqualTo("Chemistry Experiment");
        assertThat(found.get().getPriority()).isEqualTo(Priority.HIGH);
    }

    @Test
    @DisplayName("Should find tasks by status")
    void testFindByStatus() {
        List<Task> pendingTasks = taskRepository.findByStatus(Status.PENDING);
        assertThat(pendingTasks).hasSize(1);
        assertThat(pendingTasks.get(0).getTaskName()).isEqualTo("Complete Math Assignment");

        Page<Task> inProgressPage = taskRepository.findByStatus(Status.IN_PROGRESS, PageRequest.of(0, 10));
        assertThat(inProgressPage.getContent()).hasSize(1);
        assertThat(inProgressPage.getContent().get(0).getSubject()).isEqualTo("History");
    }

    @Test
    @DisplayName("Should find tasks by priority")
    void testFindByPriority() {
        List<Task> highPriorityTasks = taskRepository.findByPriority(Priority.HIGH);
        assertThat(highPriorityTasks).hasSize(1);
        assertThat(highPriorityTasks.get(0).getTaskName()).isEqualTo("Complete Math Assignment");

        Page<Task> lowPriorityPage = taskRepository.findByPriority(Priority.LOW, PageRequest.of(0, 10));
        assertThat(lowPriorityPage.getContent()).hasSize(1);
        assertThat(lowPriorityPage.getContent().get(0).getSubject()).isEqualTo("Physics");
    }

    @Test
    @DisplayName("Should search tasks by task name or subject case-insensitively")
    void testFindByTaskNameContainingIgnoreCaseOrSubjectContainingIgnoreCase() {
        Page<Task> searchByTaskName = taskRepository
                .findByTaskNameContainingIgnoreCaseOrSubjectContainingIgnoreCase("math", "math", PageRequest.of(0, 10));
        assertThat(searchByTaskName.getContent()).hasSize(1);
        assertThat(searchByTaskName.getContent().get(0).getSubject()).isEqualTo("Mathematics");

        Page<Task> searchBySubject = taskRepository
                .findByTaskNameContainingIgnoreCaseOrSubjectContainingIgnoreCase("phys", "phys", PageRequest.of(0, 10));
        assertThat(searchBySubject.getContent()).hasSize(1);
        assertThat(searchBySubject.getContent().get(0).getTaskName()).isEqualTo("Physics Lab Report");
    }

    @Test
    @DisplayName("Should find tasks with deadline between start and end dates")
    void testFindByDeadlineBetween() {
        LocalDateTime start = LocalDateTime.now().plusDays(1);
        LocalDateTime end = LocalDateTime.now().plusDays(6);

        List<Task> tasksInRange = taskRepository.findByDeadlineBetween(start, end);
        assertThat(tasksInRange).hasSize(2);
    }

    @Test
    @DisplayName("Should count tasks accurately by status")
    void testCountByStatus() {
        long pendingCount = taskRepository.countByStatus(Status.PENDING);
        long inProgressCount = taskRepository.countByStatus(Status.IN_PROGRESS);
        long completedCount = taskRepository.countByStatus(Status.COMPLETED);

        assertThat(pendingCount).isEqualTo(1);
        assertThat(inProgressCount).isEqualTo(1);
        assertThat(completedCount).isEqualTo(1);
    }
}
