package com.studyplanner.taskmanager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Paginated Response Wrapper DTO.
 * Responsibility: Wraps paginated list results for tasks.
 * Structure: { content: List<T>, page: int, size: int, totalElements: long, totalPages: int, last: boolean }
 *
 * @param <T> content element type
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagedResponse<T> {

    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean last;
}
