import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Centered Loading Spinner.
 * Responsibility: Reusable loading state indicator for asynchronous views and widget containers.
 *
 * @param {Object} props
 * @param {string} [props.message='Loading...'] - Optional helper message underneath spinner
 * @param {string|number} [props.minHeight='240px'] - Minimum height of loading container
 * @param {number} [props.size=40] - Spinner size in pixels
 * @param {'primary'|'secondary'|'inherit'} [props.color='primary'] - Spinner color
 */
export default function LoadingSpinner({
  message = 'Loading...',
  minHeight = '240px',
  size = 40,
  color = 'primary',
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        py: 4,
        px: 2,
        width: '100%',
      }}
      role="status"
      aria-live="polite"
    >
      <CircularProgress
        size={size}
        color={color}
        thickness={4}
        sx={{ mb: message ? 2 : 0 }}
      />
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500, letterSpacing: '0.01em' }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}
