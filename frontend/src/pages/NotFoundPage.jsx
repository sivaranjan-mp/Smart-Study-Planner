import React from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import ExploreOffRoundedIcon from '@mui/icons-material/ExploreOffRounded';
import { Link as RouterLink } from 'react-router-dom';

/**
 * 404 Not Found Page.
 * Responsibility: Catch-all route page displaying 404 message and navigation links
 * back to valid application routes (Dashboard and Task List). Serves as routing smoke test.
 */
export default function NotFoundPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 6 },
          maxWidth: 540,
          textAlign: 'center',
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'error.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <ExploreOffRoundedIcon sx={{ fontSize: 38 }} />
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2.25rem', sm: '3rem' },
            color: 'text.primary',
            letterSpacing: '-0.03em',
            mb: 1,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 1.5,
          }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 4,
            lineHeight: 1.6,
          }}
        >
          The page you are looking for might have been removed, had its name changed,
          or does not exist. Use the links below to get back on track.
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            startIcon={<HomeRoundedIcon />}
            sx={{ px: 3, py: 1 }}
          >
            Back to Dashboard
          </Button>

          <Button
            component={RouterLink}
            to="/tasks"
            variant="outlined"
            color="primary"
            startIcon={<AssignmentRoundedIcon />}
            sx={{ px: 3, py: 1 }}
          >
            View Task List
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
