import apiClient from './apiClient.js';

/**
 * Dashboard REST API Service.
 * Responsibility: Service methods for fetching dashboard summary aggregates
 * per Section 4.3 & 5.2 of architecture.
 */

/**
 * Fetch dashboard summary metrics and upcoming deadlines.
 * Endpoint: GET /dashboard/summary
 *
 * @returns {Promise<Object>} DashboardSummaryResponse { totalTasks, completedTasks, pendingTasks, inProgressTasks, completionPercentage, upcomingDeadlines }
 */
export const getDashboardSummary = () => {
  return apiClient.get('/dashboard/summary');
};

export const dashboardService = {
  getDashboardSummary,
};

export default dashboardService;
