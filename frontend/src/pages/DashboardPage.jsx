import React from 'react';
import { Box, Grid, Button } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Link as RouterLink } from 'react-router-dom';
import useDashboardSummary from '../hooks/useDashboardSummary.js';
import PageHeader from '../components/common/PageHeader.jsx';
import ErrorBanner from '../components/common/ErrorBanner.jsx';
import SummaryCard from '../components/dashboard/SummaryCard.jsx';
import CompletionChart from '../components/dashboard/CompletionChart.jsx';
import UpcomingDeadlinesList from '../components/dashboard/UpcomingDeadlinesList.jsx';

/**
 * Dashboard Page.
 * Responsibility: Landing view (Route: `/`) rendering overview stats,
 * completion progress, and nearest upcoming deadlines per Section 5.2 of architecture.
 */
export default function DashboardPage() {
  const { data, loading, error, refetch } = useDashboardSummary();

  const summaryCards = [
    {
      label: 'Total Tasks',
      value: data?.totalTasks,
      icon: <DashboardRoundedIcon />,
      color: '#4f46e5',
      subtext: 'All study assignments',
    },
    {
      label: 'Completed',
      value: data?.completedTasks,
      icon: <CheckCircleRoundedIcon />,
      color: '#10b981',
      subtext: 'Finished successfully',
    },
    {
      label: 'In Progress',
      value: data?.inProgressTasks,
      icon: <PendingActionsRoundedIcon />,
      color: '#f59e0b',
      subtext: 'Currently being worked on',
    },
    {
      label: 'Pending',
      value: data?.pendingTasks,
      icon: <HourglassEmptyRoundedIcon />,
      color: '#3b82f6',
      subtext: 'Awaiting start',
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <PageHeader
        title="Dashboard Overview"
        subtitle="Real-time task metrics, completion progress, and upcoming deadline schedule."
        action={
          <Button
            component={RouterLink}
            to="/tasks/new"
            variant="contained"
            color="primary"
            startIcon={<AddRoundedIcon />}
          >
            Create Task
          </Button>
        }
      />

      {/* Error Alert */}
      {error && (
        <ErrorBanner
          error={error}
          onRetry={refetch}
          title="Could not load dashboard statistics"
        />
      )}

      {/* Metric Stat Cards Grid */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {summaryCards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <SummaryCard
              label={card.label}
              value={card.value}
              icon={card.icon}
              color={card.color}
              subtext={card.subtext}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>

      {/* Chart & Upcoming Deadlines Section */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <CompletionChart
            percentage={data?.completionPercentage}
            completed={data?.completedTasks}
            total={data?.totalTasks}
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <UpcomingDeadlinesList
            tasks={data?.upcomingDeadlines || []}
            loading={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
