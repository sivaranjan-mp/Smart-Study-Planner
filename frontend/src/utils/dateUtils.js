import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Format date for display (e.g. "Sep 15, 2026").
 * @param {string|Date|dayjs.Dayjs} date
 * @param {string} [format='MMM D, YYYY']
 * @returns {string}
 */
export const formatDate = (date, format = 'MMM D, YYYY') => {
  if (!date) return '—';
  const d = dayjs(date);
  return d.isValid() ? d.format(format) : '—';
};

/**
 * Format date and time for display (e.g. "Sep 15, 2026, 4:30 PM").
 * @param {string|Date|dayjs.Dayjs} date
 * @param {string} [format='MMM D, YYYY, h:mm A']
 * @returns {string}
 */
export const formatDateTime = (date, format = 'MMM D, YYYY, h:mm A') => {
  if (!date) return '—';
  const d = dayjs(date);
  return d.isValid() ? d.format(format) : '—';
};

/**
 * Calculate difference in days between now and deadline.
 * @param {string|Date} deadline
 * @returns {number|null}
 */
export const getDaysRemaining = (deadline) => {
  if (!deadline) return null;
  const d = dayjs(deadline);
  if (!d.isValid()) return null;
  return d.diff(dayjs(), 'day');
};

/**
 * Returns human-readable relative time string (e.g. "in 2 days", "3 hours ago").
 * @param {string|Date} date
 * @returns {string}
 */
export const getRelativeTime = (date) => {
  if (!date) return '—';
  const d = dayjs(date);
  return d.isValid() ? d.fromNow() : '—';
};

/**
 * Check if a task deadline is overdue.
 * @param {string|Date} deadline
 * @param {string} [status]
 * @returns {boolean}
 */
export const isOverdue = (deadline, status) => {
  if (!deadline || status === 'COMPLETED') return false;
  const d = dayjs(deadline);
  return d.isValid() && d.isBefore(dayjs());
};
