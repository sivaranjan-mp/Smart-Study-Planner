import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Stack,
  Divider,
  Tooltip,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import useTask from '../hooks/useTask.js';
import { deleteTask } from '../services/taskService.js';
import PageHeader from '../components/common/PageHeader.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorBanner from '../components/common/ErrorBanner.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import PriorityChip from '../components/tasks/PriorityChip.jsx';
import StatusChip from '../components/tasks/StatusChip.jsx';
import { formatDateTime, getRelativeTime, isOverdue } from '../utils/dateUtils.js';

/**
 * Task Details Page.
 * Responsibility: Single task detail view (Route: `/tasks/:id`) per Section 5.3 of architecture.
 */
export default function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: task, loading, error, refetch } = useTask(id);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const handleDelete = async () => {
    setDeleteLoading(true);
    setActionError(null);
    try {
      await deleteTask(id);
      navigate('/tasks');
    } catch (err) {
      setActionError(err);
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  };

  if (loading && !task) {
    return <LoadingSpinner message={`Loading task #${id}...`} />;
  }

  if (error || !task) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <PageHeader
          title="Task Details"
          backButton={
            <Button
              component={RouterLink}
              to="/tasks"
              startIcon={<ArrowBackRoundedIcon />}
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              Back to Tasks
            </Button>
          }
        />
        <ErrorBanner
          error={error || 'Task not found or has been deleted.'}
          onRetry={refetch}
          title="Could not load task details"
        />
      </Box>
    );
  }

  const overdue = isOverdue(task.deadline, task.status);

  return (
    <Box sx={{ maxWidth: 850, mx: 'auto' }}>
      {/* Page Header */}
      <PageHeader
        title={task.taskName}
        subtitle={`Subject: ${task.subject}`}
        badge={
          <Stack direction="row" spacing={1} alignItems="center">
            <PriorityChip priority={task.priority} />
            <StatusChip status={task.status} />
          </Stack>
        }
        backButton={
          <Button
            component={RouterLink}
            to="/tasks"
            startIcon={<ArrowBackRoundedIcon />}
            size="small"
            sx={{ color: 'text.secondary', fontWeight: 500 }}
          >
            Back to Tasks
          </Button>
        }
        action={
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

            <Tooltip title="Delete Task">
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlineRoundedIcon />}
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </Button>
            </Tooltip>
          </Stack>
        }
      />

      {/* Action Error Alert */}
      {actionError && (
        <ErrorBanner
          error={actionError}
          title="Action failed"
        />
      )}

      {/* Main Details Paper Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          mb: 4,
        }}
      >
        {/* Key Attributes Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Subject */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Subject
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {task.subject}
            </Typography>
          </Grid>

          {/* Priority */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Priority Level
            </Typography>
            <PriorityChip priority={task.priority} />
          </Grid>

          {/* Status */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Current Status
            </Typography>
            <StatusChip status={task.status} />
          </Grid>

          {/* Deadline */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Deadline
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {overdue ? (
                <WarningAmberRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
              ) : (
                <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: overdue ? 700 : 600,
                  color: overdue ? 'error.main' : 'text.primary',
                }}
              >
                {formatDateTime(task.deadline)}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              color={overdue ? 'error.main' : 'text.secondary'}
              sx={{ display: 'block', mt: 0.25 }}
            >
              {getRelativeTime(task.deadline)} {overdue ? '(Overdue)' : ''}
            </Typography>
          </Grid>

          {/* Created At */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Created Date
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDateTime(task.createdAt)}
            </Typography>
          </Grid>

          {/* Updated At */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Last Modified
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDateTime(task.updatedAt)}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Description Section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <SubjectRoundedIcon color="action" fontSize="small" />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Description & Notes
            </Typography>
          </Box>

          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: '#f8fafc',
              borderColor: '#e2e8f0',
            }}
          >
            {task.description ? (
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.7,
                  color: 'text.primary',
                  fontSize: '0.9375rem',
                }}
              >
                {task.description}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No additional description provided for this task.
              </Typography>
            )}
          </Paper>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.taskName}"? This action cannot be undone.`}
        confirmText="Delete Task"
        severity="error"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}
