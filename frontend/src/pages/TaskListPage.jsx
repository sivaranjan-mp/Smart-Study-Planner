import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Task List Page.
 * Responsibility: List view (Route: `/tasks`). In Phase 5, serves as routing & layout foundation.
 * Task table, search, filters, and pagination will be integrated in Phase 6.
 */
export default function TaskListPage() {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              All Study Tasks
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
            Manage, filter, search, and monitor all tasks in your study schedule.
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/tasks/new"
          variant="contained"
          color="primary"
          startIcon={<AddRoundedIcon />}
        >
          Create Task
        </Button>
      </Box>

      {/* Placeholder Table / Grid Container */}
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
          <AssignmentRoundedIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Task Table & Search (Phase 6)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: 'auto' }}>
          Paginated table, responsive card grid, instant search bar, and priority/status filter controls will be implemented in Phase 6.
        </Typography>
      </Paper>
    </Box>
  );
}
