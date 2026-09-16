import React from 'react';
import { Alert, AlertTitle, Button, Box, Typography } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

/**
 * Reusable Error Banner.
 * Responsibility: MUI Alert displaying error states from failed API calls with optional retry action.
 *
 * @param {Object} props
 * @param {string|Object|Error|null} props.error - Error object or message
 * @param {Function} [props.onRetry] - Optional retry handler callback
 * @param {string} [props.title='Error'] - Alert title
 * @param {'error'|'warning'|'info'} [props.severity='error'] - Severity level
 * @param {Object} [props.sx] - Additional MUI sx styling overrides
 */
export default function ErrorBanner({
  error,
  onRetry,
  title = 'Something went wrong',
  severity = 'error',
  sx,
}) {
  if (!error) return null;

  const errorMessage =
    typeof error === 'string'
      ? error
      : error?.message || 'An unexpected error occurred. Please try again.';

  const details = Array.isArray(error?.details) ? error.details : [];

  return (
    <Alert
      severity={severity}
      sx={{
        borderRadius: 2.5,
        border: '1px solid',
        borderColor: severity === 'error' ? '#fecaca' : '#fed7aa',
        mb: 3,
        alignItems: 'center',
        ...sx,
      }}
      action={
        onRetry ? (
          <Button
            color="inherit"
            size="small"
            onClick={onRetry}
            startIcon={<RefreshRoundedIcon />}
            sx={{ fontWeight: 600, textTransform: 'none' }}
          >
            Retry
          </Button>
        ) : null
      }
    >
      <AlertTitle sx={{ fontWeight: 700, mb: 0.5 }}>{title}</AlertTitle>
      <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
        {errorMessage}
      </Typography>

      {details.length > 0 && (
        <Box component="ul" sx={{ pl: 2.5, mt: 1, mb: 0 }}>
          {details.map((item, idx) => (
            <Typography component="li" variant="caption" key={idx}>
              {item}
            </Typography>
          ))}
        </Box>
      )}
    </Alert>
  );
}
