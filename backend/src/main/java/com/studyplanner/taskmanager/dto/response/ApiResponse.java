package com.studyplanner.taskmanager.dto.response;

/**
 * Standard Generic API Response Envelope.
 * Responsibility: Wraps all successful controller responses for a consistent client contract.
 * Structure: { success: boolean, message: String, data: T, timestamp: LocalDateTime }
 *
 * @param <T> the payload data type
 */
public class ApiResponse<T> {
    // TODO: Define success flag (boolean)
    // TODO: Define message (String)
    // TODO: Define data payload (T)
    // TODO: Define timestamp (LocalDateTime)
    // TODO: Define static helper factories: success(T data), success(String message, T data)
}
