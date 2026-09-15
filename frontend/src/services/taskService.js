import apiClient from './apiClient.js';

/**
 * Task REST API Service.
 * Responsibility: Wrapper functions calling apiClient for all Task endpoints
 * (GET, POST, PUT, DELETE, search, filter) per Section 4.3 & 5.2 of architecture.
 *
 * All functions return Promises. Successful responses are automatically unwrapped
 * by the apiClient response interceptor to yield the payload data directly.
 */

/**
 * Fetch paginated list of tasks.
 * Endpoint: GET /tasks (or /api/tasks via baseURL)
 *
 * @param {Object} [params] - Query parameters
 * @param {number} [params.page=0] - 0-indexed page number
 * @param {number} [params.size=10] - Page size
 * @param {string} [params.sortBy='createdAt'] - Sort field (e.g., 'createdAt', 'deadline')
 * @param {string} [params.sortDirection='desc'] - Sort direction ('asc' | 'desc')
 * @returns {Promise<Object>} PagedResponse<TaskResponse> { content, pageNumber, pageSize, totalElements, totalPages, isLast }
 */
export const getTasks = (params) => {
  return apiClient.get('/tasks', { params });
};

/**
 * Fetch a single task by its unique ID.
 * Endpoint: GET /tasks/{id}
 *
 * @param {number|string} id - Task ID
 * @returns {Promise<Object>} TaskResponse { id, taskName, subject, description, priority, deadline, status, createdAt, updatedAt }
 */
export const getTaskById = (id) => {
  return apiClient.get(`/tasks/${id}`);
};

/**
 * Create a new task.
 * Endpoint: POST /tasks
 *
 * @param {Object} payload - TaskCreateRequest
 * @param {string} payload.taskName - Task name (required, max 150)
 * @param {string} payload.subject - Subject (required, max 100)
 * @param {string} [payload.description] - Description (optional, max 1000)
 * @param {string} payload.priority - Priority enum ('LOW' | 'MEDIUM' | 'HIGH')
 * @param {string} payload.deadline - ISO-8601 deadline string (required)
 * @param {string} [payload.status='PENDING'] - Initial status ('PENDING' | 'IN_PROGRESS' | 'COMPLETED')
 * @returns {Promise<Object>} TaskResponse of created task
 */
export const createTask = (payload) => {
  return apiClient.post('/tasks', payload);
};

/**
 * Update an existing task (full update).
 * Endpoint: PUT /tasks/{id}
 *
 * @param {number|string} id - Task ID
 * @param {Object} payload - TaskUpdateRequest
 * @param {string} payload.taskName - Task name (required)
 * @param {string} payload.subject - Subject (required)
 * @param {string} [payload.description] - Description (optional)
 * @param {string} payload.priority - Priority enum
 * @param {string} payload.deadline - ISO-8601 deadline string
 * @param {string} payload.status - Status enum
 * @returns {Promise<Object>} TaskResponse of updated task
 */
export const updateTask = (id, payload) => {
  return apiClient.put(`/tasks/${id}`, payload);
};

/**
 * Delete a task by its unique ID.
 * Endpoint: DELETE /tasks/{id}
 *
 * @param {number|string} id - Task ID
 * @returns {Promise<void>}
 */
export const deleteTask = (id) => {
  return apiClient.delete(`/tasks/${id}`);
};

/**
 * Search tasks by keyword in taskName or subject.
 * Endpoint: GET /tasks/search
 *
 * @param {Object} params - Query parameters
 * @param {string} [params.keyword] - Search term
 * @param {number} [params.page=0] - Page number
 * @param {number} [params.size=10] - Page size
 * @returns {Promise<Object>} PagedResponse<TaskResponse>
 */
export const searchTasks = (params) => {
  return apiClient.get('/tasks/search', { params });
};

/**
 * Filter tasks by priority, status, sorting, and pagination.
 * Endpoint: GET /tasks/filter
 *
 * @param {Object} params - Filter query parameters
 * @param {string} [params.priority] - Filter by Priority ('LOW' | 'MEDIUM' | 'HIGH')
 * @param {string} [params.status] - Filter by Status ('PENDING' | 'IN_PROGRESS' | 'COMPLETED')
 * @param {string} [params.sortBy] - Sort field ('deadline' | 'createdAt')
 * @param {string} [params.sortDirection] - Sort direction ('asc' | 'desc')
 * @param {number} [params.page] - Page number
 * @param {number} [params.size] - Page size
 * @returns {Promise<Object>} PagedResponse<TaskResponse>
 */
export const filterTasks = (params) => {
  return apiClient.get('/tasks/filter', { params });
};

export const taskService = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  searchTasks,
  filterTasks,
};

export default taskService;
