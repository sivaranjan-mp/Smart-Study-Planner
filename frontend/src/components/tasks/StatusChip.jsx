import React from 'react';
import { Chip } from '@mui/material';
import { STATUS_COLOR_MAP } from '../../utils/constants.js';

/**
 * Status Chip Indicator.
 * Responsibility: Presentational MUI Chip mapping task status to semantic color
 * per Section 5.5 of architecture (PENDING -> info, IN_PROGRESS -> warning, COMPLETED -> success).
 *
 * @param {Object} props
 * @param {'PENDING'|'IN_PROGRESS'|'COMPLETED'|string} props.status - Task status
 * @param {'small'|'medium'} [props.size='small'] - Chip size
 * @param {'filled'|'outlined'} [props.variant='filled'] - Chip variant
 * @param {Object} [props.sx] - Additional styles
 */
export default function StatusChip({
  status,
  size = 'small',
  variant = 'filled',
  sx,
}) {
  if (!status) return null;

  const normalizedStatus = String(status).toUpperCase();
  const color = STATUS_COLOR_MAP[normalizedStatus] || 'default';

  const labelMap = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
  };

  const label = labelMap[normalizedStatus] || status;

  return (
    <Chip
      label={label}
      color={color}
      size={size}
      variant={variant}
      sx={{
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.8125rem',
        ...sx,
      }}
    />
  );
}
