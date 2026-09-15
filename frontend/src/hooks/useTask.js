import { useState, useEffect, useCallback } from 'react';

/**
 * Single Task Fetching Hook.
 * Responsibility: Fetches single task by ID ({ data, loading, error, refetch }) for details and edit views.
 */
export default function useTask(id) {
  // TODO: Manage single task state, fetch via taskService.getTaskById
  return { data: null, loading: false, error: null, refetch: () => {} };
}
