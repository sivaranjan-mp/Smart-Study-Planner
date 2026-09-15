import axios from 'axios';

/**
 * Configured Axios API Client.
 * Responsibility: Central Axios instance configured with base URL, headers, and interceptors
 * to unwrap the Spring Boot ApiResponse envelope and normalize error payloads.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach headers or log outgoing requests if needed
apiClient.interceptors.request.use(
  (config) => {
    // Config hook for auth tokens or custom headers in future iterations
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Unwrap ApiResponse<T> envelope and normalize error responses
apiClient.interceptors.response.use(
  (response) => {
    // If backend returns standard ApiResponse envelope { success, message, data, timestamp },
    // unwrap and return response.data.data directly for cleaner service consumption.
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    // Normalize backend ErrorResponse envelope or network failure
    const errorResponse = error.response?.data;
    const normalizedError = {
      status: error.response?.status || 500,
      message:
        errorResponse?.message ||
        error.message ||
        'An unexpected network or server error occurred.',
      errorCode: errorResponse?.errorCode || 'UNKNOWN_ERROR',
      details: errorResponse?.details || [],
      timestamp: errorResponse?.timestamp || new Date().toISOString(),
      raw: error,
    };

    return Promise.reject(normalizedError);
  }
);

export default apiClient;
