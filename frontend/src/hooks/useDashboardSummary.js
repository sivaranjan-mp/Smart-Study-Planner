import { useState, useEffect, useCallback } from 'react';
import { getDashboardSummary } from '../services/dashboardService.js';

/**
 * Dashboard Summary Fetching Hook.
 * Responsibility: Fetches aggregated dashboard metrics and upcoming deadlines on mount
 * and provides a refetch trigger.
 *
 * @returns {{
 *   data: Object|null,
 *   loading: boolean,
 *   error: Object|null,
 *   refetch: () => Promise<void>
 * }}
 */
export default function useDashboardSummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDashboardSummary();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getDashboardSummary();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    executeFetch();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error, refetch: fetchSummary };
}
