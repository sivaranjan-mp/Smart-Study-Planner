import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import AssignmentLateRoundedIcon from '@mui/icons-material/AssignmentLateRounded';

/**
 * Empty State Placeholder.
 * Responsibility: Displayed when no tasks/records match the query, filter, or on empty initial state.
 *
 * @param {Object} props
 * @param {string} [props.title='No tasks found'] - Main heading text
 * @param {string} [props.description] - Secondary explanatory text
 * @param {React.ReactNode} [props.action] - Optional action button CTA
 * @param {React.ReactNode} [props.icon] - Optional custom icon
 * @param {string|number} [props.minHeight='280px'] - Minimum height of container
 */
export default function EmptyState({
  title = 'No tasks found',
  description = 'There are currently no items to display. Try changing your search or filters.',
  action,
  icon,
  minHeight = '280px',
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight,
        p: { xs: 3, sm: 5 },
        borderRadius: 3,
        border: '1px dashed #cbd5e1',
        backgroundColor: '#ffffff',
        width: '100%',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: 'rgba(79, 70, 229, 0.08)',
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        {icon || <AssignmentLateRoundedIcon sx={{ fontSize: 30 }} />}
      </Box>

      <Typography
        variant="h6"
        component="h3"
        sx={{ fontWeight: 600, color: 'text.primary', mb: 0.75 }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 440, mb: action ? 3 : 0, lineHeight: 1.5 }}
        >
          {description}
        </Typography>
      )}

      {action && <Box sx={{ mt: description ? 0 : 2 }}>{action}</Box>}
    </Paper>
  );
}
