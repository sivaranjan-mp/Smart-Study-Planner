-- ==============================================================================
-- Smart Study Planner & Task Management System
-- Database: study_planner_db
-- Schema matching architecture.md Section 3.2
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS study_planner_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE study_planner_db;

-- ------------------------------------------------------------------------------
-- Table: tasks
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_name VARCHAR(150) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    description TEXT NULL,
    priority ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL DEFAULT 'MEDIUM',
    deadline DATETIME NOT NULL,
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Recommended Indexes per Section 3.2
    INDEX idx_tasks_deadline (deadline),
    INDEX idx_tasks_status (status),
    INDEX idx_tasks_priority (priority),
    INDEX idx_tasks_subject (subject),
    INDEX idx_tasks_status_deadline (status, deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
