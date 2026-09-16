package com.studyplanner.taskmanager.exception;

/**
 * Resource Not Found Exception.
 * Responsibility: Unchecked exception thrown when a requested task entity lookup fails by ID.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
    }
}
