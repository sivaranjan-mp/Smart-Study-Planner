package com.studyplanner.taskmanager.exception;

/**
 * Invalid Request Exception.
 * Responsibility: Unchecked exception thrown for business-rule violations or invalid parameter combinations.
 */
public class InvalidRequestException extends RuntimeException {

    // TODO: Implement constructors accepting message
    public InvalidRequestException(String message) {
        super(message);
    }
}
