import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

/**
 * Reusable Confirmation Dialog.
 * Responsibility: Reusable MUI Dialog for confirming destructive/important actions (e.g., deleting a task).
 *
 * @param {Object} props
 * @param {boolean} props.open - Whether dialog is open
 * @param {string} [props.title='Confirm Action'] - Dialog title text
 * @param {string} [props.message='Are you sure you want to proceed?'] - Dialog description message
 * @param {Function} props.onConfirm - Confirm callback
 * @param {Function} props.onCancel - Cancel/Close callback
 * @param {string} [props.confirmText='Confirm'] - Label for confirm button
 * @param {string} [props.cancelText='Cancel'] - Label for cancel button
 * @param {'error'|'warning'|'primary'} [props.severity='error'] - Severity color of action
 * @param {boolean} [props.loading=false] - Whether action is in progress
 */
export default function ConfirmDialog({
  open,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'error',
  loading = false,
}) {
  const isDestructive = severity === 'error';

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle
        id="confirm-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          fontWeight: 700,
          fontSize: '1.125rem',
          pb: 1,
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            backgroundColor: isDestructive ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: isDestructive ? 'error.main' : 'warning.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {isDestructive ? (
            <DeleteOutlineRoundedIcon sx={{ fontSize: 22 }} />
          ) : (
            <WarningAmberRoundedIcon sx={{ fontSize: 22 }} />
          )}
        </Box>
        {title}
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <DialogContentText
          id="confirm-dialog-description"
          sx={{ color: 'text.secondary', fontSize: '0.875rem', lineHeight: 1.6 }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onCancel}
          disabled={loading}
          sx={{ borderColor: '#cbd5e1', color: 'text.secondary' }}
        >
          {cancelText}
        </Button>
        <Button
          variant="contained"
          color={severity === 'error' ? 'error' : 'primary'}
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ minWidth: 90 }}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
