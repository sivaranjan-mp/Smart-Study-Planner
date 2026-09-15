import React from 'react';
import { Box, Typography, Paper, Button, Chip, Stack } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import { useParams, Link as RouterLink } from 'react-router-dom';

/**
 * Task Details Page.
 * Responsibility: Single task detail view (Route: `/tasks/:id`).
 * In Phase 5, serves as routing & route parameter smoke test.
 * Full task display, status change, and delete confirmation dialog will be integrated in Phase 6.
 */
export default function TaskDetailsPage() {
  const { id } = useParams();

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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                Task Details #{id}
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
              Detailed view of task attributes, status, and deadlines.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              component={RouterLink}
              to={`/tasks/${id}/edit`}
              variant="contained"
              color="primary"
              startIcon={<EditRoundedIcon />}
            >
              Edit Task
            </Button>
          </Stack>
        </Box>
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
          <DescriptionRoundedIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Task Detail View for ID: {id} (Phase 6)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: 'auto' }}>
          Full metadata display, status updates, and delete flow will be implemented in Phase 6.
        </Typography>
      </Paper>
    </Box>
  );
}
