package com.studyplanner.taskmanager.exception;

import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global REST Exception Handler.
 * Responsibility: @RestControllerAdvice handling MethodArgumentNotValidException (400),
 * ResourceNotFoundException (404), InvalidRequestException (400), and generic Exception (500).
 * Always returns standardized ErrorResponse entity.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    // TODO: @ExceptionHandler(MethodArgumentNotValidException.class) -> 400 Bad Request with field errors
    // TODO: @ExceptionHandler(ResourceNotFoundException.class) -> 404 Not Found
    // TODO: @ExceptionHandler(InvalidRequestException.class) -> 400 Bad Request
    // TODO: @ExceptionHandler(Exception.class) -> 500 Internal Server Error (safe generic message)
}
