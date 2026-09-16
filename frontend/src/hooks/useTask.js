import { useState, useEffect, useCallback } from 'react';
import { getTaskById } from '../services/taskService.js';

/**
 * Single Task Fetching Hook.
 * Responsibility: Fetches single task by ID for details and edit views,
 * returning { data, loading, error, refetch }.
 *
 * @param {number|string|null|undefined} id - Task ID to fetch
 * @returns {{
 *   data: Object|null,
 *   loading: boolean,
 *   error: Object|null,
 *   refetch: () => Promise<void>
 * }}
 */
export default function useTask(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  const fetchTask = useCallback(async () => {
    if (!id) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await getTaskById(id);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }

    let isMounted = true;

    const executeFetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getTaskById(id);
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
  }, [id]);

  return { data, loading: Boolean(id) && loading, error, refetch: fetchTask };
}
