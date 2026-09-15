package com.studyplanner.taskmanager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Standard API Error Response Envelope.
 * Responsibility: Returned by GlobalExceptionHandler for consistent error reporting across all endpoints.
 * Structure: { success: false, message: String, errorCode: String, details: List<String>, timestamp: LocalDateTime, path: String }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {

    @Builder.Default
    private boolean success = false;

    private String message;

    private String errorCode;

    private List<String> details;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    private String path;
}
