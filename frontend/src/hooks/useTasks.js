import { useState, useEffect, useCallback, useMemo } from 'react';
import { getTasks, searchTasks, filterTasks } from '../services/taskService.js';

/**
 * Tasks List Fetching Hook.
 * Responsibility: Encapsulates list fetching state machine ({ data, loading, error, refetch })
 * reacting to query params (pagination, sorting, search keyword, and filters).
 *
 * @param {Object} [params={}] - Query parameters
 * @param {string} [params.keyword] - Search term
 * @param {string} [params.priority] - Filter by Priority ('LOW' | 'MEDIUM' | 'HIGH')
 * @param {string} [params.status] - Filter by Status ('PENDING' | 'IN_PROGRESS' | 'COMPLETED')
 * @param {string} [params.sortBy] - Sort column ('createdAt' | 'deadline')
 * @param {string} [params.sortDirection] - Sort direction ('asc' | 'desc')
 * @param {number} [params.page] - Page number (0-indexed)
 * @param {number} [params.size] - Page size
 * @returns {{
 *   data: Object|null,
 *   loading: boolean,
 *   error: Object|null,
 *   refetch: () => Promise<void>
 * }}
 */
export default function useTasks(params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize params string representation for stable dependency tracking
  const paramsKey = useMemo(() => JSON.stringify(params), [params]);

  const fetchTasksList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      const currentParams = JSON.parse(paramsKey);

      if (currentParams.keyword && currentParams.keyword.trim() !== '') {
        result = await searchTasks(currentParams);
      } else if (
        currentParams.priority ||
        currentParams.status ||
        currentParams.sortBy ||
        currentParams.sortDirection
      ) {
        result = await filterTasks(currentParams);
      } else {
        result = await getTasks(currentParams);
      }

      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [paramsKey]);

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      setLoading(true);
      setError(null);
      try {
        let result;
        const currentParams = JSON.parse(paramsKey);

        if (currentParams.keyword && currentParams.keyword.trim() !== '') {
          result = await searchTasks(currentParams);
        } else if (
          currentParams.priority ||
          currentParams.status ||
          currentParams.sortBy ||
          currentParams.sortDirection
        ) {
          result = await filterTasks(currentParams);
        } else {
          result = await getTasks(currentParams);
        }

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
  }, [paramsKey]);

  return { data, loading, error, refetch: fetchTasksList };
}
