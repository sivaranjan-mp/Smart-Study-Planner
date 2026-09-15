package com.studyplanner.taskmanager.exception;

/**
 * Resource Not Found Exception.
 * Responsibility: Unchecked exception thrown when a requested task entity lookup fails by ID.
 */
public class ResourceNotFoundException extends RuntimeException {

    // TODO: Implement constructors accepting message or resource identification parameters
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
