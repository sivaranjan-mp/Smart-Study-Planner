import axios from 'axios';

/**
 * Configured Axios API Client.
 * Responsibility: Central Axios instance configured with base URL, headers, and response interceptors to unwrap ApiResponse.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// TODO: Add request/response interceptors for unwrapping response envelopes and normalizing errors

export default apiClient;
