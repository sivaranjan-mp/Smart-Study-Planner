import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useParams, Link as RouterLink } from 'react-router-dom';

/**
 * Edit Task Page.
 * Responsibility: Edit Task view (Route: `/tasks/:id/edit`).
 * In Phase 5, serves as routing & route parameter smoke test.
 * TaskForm pre-population and API mutation will be integrated in Phase 6.
 */
export default function EditTaskPage() {
  const { id } = useParams();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Button
          component={RouterLink}
          to={`/tasks/${id}`}
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ mb: 2, color: 'text.secondary', fontWeight: 500 }}
          size="small"
        >
          Back to Details
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Edit Task #{id}
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
          Update task details, modify priority, status, and deadline.
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
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            color: 'warning.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <EditRoundedIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Edit Form for Task ID: {id} (Phase 6)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: 'auto' }}>
          Form populated with existing task data and update submission will be implemented in Phase 6.
        </Typography>
      </Paper>
    </Box>
  );
}
