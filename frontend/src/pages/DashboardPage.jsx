import React from 'react';
import { Box, Typography, Paper, Grid, Chip } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';

/**
 * Dashboard Page.
 * Responsibility: Landing page (Route: `/`). In Phase 5, serves as routing & layout foundation.
 * Data-fetching hooks (useDashboardSummary) will be integrated in Phase 7.
 */
export default function DashboardPage() {
  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Dashboard Overview
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
          Welcome to Smart Study Planner. Summary widgets and deadline metrics will appear here.
        </Typography>
      </Box>

      {/* Summary Cards Grid (Responsive 1-col on xs, 2-col on sm, 4-col on md) */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {[
          { label: 'Total Tasks', value: '—', icon: <DashboardRoundedIcon />, color: '#4f46e5' },
          { label: 'Completed', value: '—', icon: <CheckCircleRoundedIcon />, color: '#10b981' },
          { label: 'In Progress', value: '—', icon: <PendingActionsRoundedIcon />, color: '#f59e0b' },
          { label: 'Pending', value: '—', icon: <HourglassEmptyRoundedIcon />, color: '#3b82f6' },
        ].map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {card.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                  {card.value}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  backgroundColor: `${card.color}15`,
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Placeholder Container for Chart & Deadlines */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Dashboard Widgets (Phase 7)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Summary widgets, completion rates, and upcoming deadlines will be wired to backend APIs in Phase 7.
        </Typography>
      </Paper>
    </Box>
  );
}
