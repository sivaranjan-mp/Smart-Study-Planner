import { useState, useEffect, useCallback } from 'react';

/**
 * Tasks List Fetching Hook.
 * Responsibility: Encapsulates list fetching state machine ({ data, loading, error, refetch }) reacting to query params.
 */
export default function useTasks(params) {
  // TODO: Manage loading, error, and tasks state
  // TODO: Fetch tasks via taskService on params change
  return { data: null, loading: false, error: null, refetch: () => {} };
}
