import dayjs from 'dayjs';

/**
 * Client-side Form Validation Utilities.
 * Responsibility: Mirrors backend Bean Validation constraints (Section 4.2).
 */

export const validateTaskName = (name) => {
  if (!name || !name.trim()) {
    return 'Task name is required';
  }
  if (name.trim().length > 150) {
    return 'Task name must not exceed 150 characters';
  }
  return null;
};

export const validateSubject = (subject) => {
  if (!subject || !subject.trim()) {
    return 'Subject is required';
  }
  if (subject.trim().length > 100) {
    return 'Subject must not exceed 100 characters';
  }
  return null;
};

export const validateDescription = (description) => {
  if (description && description.length > 1000) {
    return 'Description must not exceed 1000 characters';
  }
  return null;
};

export const validatePriority = (priority) => {
  if (!priority) {
    return 'Priority is required';
  }
  if (!['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
    return 'Invalid priority selected';
  }
  return null;
};

export const validateDeadline = (deadline) => {
  if (!deadline) {
    return 'Deadline is required';
  }
  const d = dayjs(deadline);
  if (!d.isValid()) {
    return 'Please provide a valid date and time';
  }
  return null;
};

export const validateStatus = (status) => {
  if (!status) {
    return 'Status is required';
  }
  if (!['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
    return 'Invalid status selected';
  }
  return null;
};

/**
 * Validate full task form values.
 * @param {Object} values
 * @param {boolean} [isEdit=false]
 * @returns {Object} errors map
 */
export const validateTaskForm = (values, isEdit = false) => {
  const errors = {};

  const taskNameError = validateTaskName(values.taskName);
  if (taskNameError) errors.taskName = taskNameError;

  const subjectError = validateSubject(values.subject);
  if (subjectError) errors.subject = subjectError;

  const descriptionError = validateDescription(values.description);
  if (descriptionError) errors.description = descriptionError;

  const priorityError = validatePriority(values.priority);
  if (priorityError) errors.priority = priorityError;

  const deadlineError = validateDeadline(values.deadline);
  if (deadlineError) errors.deadline = deadlineError;

  if (isEdit) {
    const statusError = validateStatus(values.status);
    if (statusError) errors.status = statusError;
  }

  return errors;
};
