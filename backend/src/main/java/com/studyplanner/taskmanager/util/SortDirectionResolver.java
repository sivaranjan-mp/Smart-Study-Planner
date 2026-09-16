package com.studyplanner.taskmanager.util;

import org.springframework.data.domain.Sort;

/**
 * Sort Direction Resolver Utility.
 * Responsibility: Translates query parameter strings ("asc"/"desc") safely into Spring Data Sort.Direction.
 */
public final class SortDirectionResolver {

    private SortDirectionResolver() {
        // Private constructor for utility class
    }

    /**
     * Resolves a string direction into Spring Data Sort.Direction.
     *
     * @param directionString   direction string input ("asc", "desc")
     * @param defaultDirection  fallback direction if input is null or unrecognized
     * @return resolved Sort.Direction
     */
    public static Sort.Direction resolve(String directionString, Sort.Direction defaultDirection) {
        if (directionString == null || directionString.trim().isEmpty()) {
            return defaultDirection != null ? defaultDirection : Sort.Direction.DESC;
        }

        String normalized = directionString.trim().toLowerCase();
        if ("asc".equals(normalized) || "ascending".equals(normalized)) {
            return Sort.Direction.ASC;
        }
        if ("desc".equals(normalized) || "descending".equals(normalized)) {
            return Sort.Direction.DESC;
        }

        return defaultDirection != null ? defaultDirection : Sort.Direction.DESC;
    }

    /**
     * Resolves a string direction into Spring Data Sort.Direction with default DESC.
     *
     * @param directionString direction string input
     * @return resolved Sort.Direction (defaults to DESC)
     */
    public static Sort.Direction resolve(String directionString) {
        return resolve(directionString, Sort.Direction.DESC);
    }
}
