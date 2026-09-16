import React from 'react';
import { Chip } from '@mui/material';
import { PRIORITY_COLOR_MAP } from '../../utils/constants.js';

/**
 * Priority Chip Indicator.
 * Responsibility: Presentational MUI Chip mapping task priority to semantic color
 * per Section 5.5 of architecture (HIGH -> error, MEDIUM -> warning, LOW -> success).
 *
 * @param {Object} props
 * @param {'LOW'|'MEDIUM'|'HIGH'|string} props.priority - Priority level
 * @param {'small'|'medium'} [props.size='small'] - Chip size
 * @param {'filled'|'outlined'} [props.variant='filled'] - Chip variant
 * @param {Object} [props.sx] - Additional styles
 */
export default function PriorityChip({
  priority,
  size = 'small',
  variant = 'filled',
  sx,
}) {
  if (!priority) return null;

  const normalizedPriority = String(priority).toUpperCase();
  const color = PRIORITY_COLOR_MAP[normalizedPriority] || 'default';

  const labelMap = {
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low',
  };

  const label = labelMap[normalizedPriority] || priority;

  return (
    <Chip
      label={label}
      color={color}
      size={size}
      variant={variant}
      sx={{
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.8125rem',
        textTransform: 'capitalize',
        ...sx,
      }}
    />
  );
}
