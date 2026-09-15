import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Add Task Page.
 * Responsibility: Create Task view (Route: `/tasks/new`).
 * In Phase 5, serves as routing & layout smoke test.
 * TaskForm with validation and API integration will be implemented in Phase 6.
 */
export default function AddTaskPage() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Button
          component={RouterLink}
          to="/tasks"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ mb: 2, color: 'text.secondary', fontWeight: 500 }}
          size="small"
        >
          Back to Tasks
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Create New Task
          </Typography>
          <Chip
            label="Phase 5 Smoke Test"
            color="info"
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          Add a task with subject, description, priority, and deadline details.
        </Typography>
      </Box>

      <Paper
        sx={{
          p: { xs: 4, sm: 6 },
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: 'rgba(79, 70, 229, 0.08)',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <AddCircleOutlineRoundedIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Task Form (Phase 6)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: 'auto' }}>
          Interactive form with validation rules, priority selects, and DateTimePicker will be connected in Phase 6.
        </Typography>
      </Paper>
    </Box>
  );
}
