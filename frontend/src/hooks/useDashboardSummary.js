import { useState, useEffect, useCallback } from 'react';

/**
 * Dashboard Summary Fetching Hook.
 * Responsibility: Fetches dashboard aggregate metrics on mount ({ data, loading, error, refetch }).
 */
export default function useDashboardSummary() {
  // TODO: Fetch dashboard summary aggregates on mount via dashboardService
  return { data: null, loading: false, error: null, refetch: () => {} };
}
