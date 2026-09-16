/**
 * Application Constants and Enum Mappings.
 * Responsibility: Single source of truth for Priority, Status, Sort Options,
 * and semantic UI color tokens mirrored from backend enums.
 */

export const PRIORITY_OPTIONS = [
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

export const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Creation Date' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'taskName', label: 'Task Name' },
  { value: 'priority', label: 'Priority' },
];

export const SORT_DIRECTION_OPTIONS = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
];

export const PRIORITY_COLOR_MAP = {
  HIGH: 'error',
  MEDIUM: 'warning',
  LOW: 'success',
};

export const STATUS_COLOR_MAP = {
  PENDING: 'info',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
};
