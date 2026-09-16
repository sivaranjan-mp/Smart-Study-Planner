import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Pagination,
  Typography,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Link as RouterLink } from 'react-router-dom';
import useTasks from '../hooks/useTasks.js';
import { deleteTask } from '../services/taskService.js';
import PageHeader from '../components/common/PageHeader.jsx';
import ErrorBanner from '../components/common/ErrorBanner.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import TaskSearchBar from '../components/tasks/TaskSearchBar.jsx';
import TaskFilterBar from '../components/tasks/TaskFilterBar.jsx';
import TaskTable from '../components/tasks/TaskTable.jsx';
import TaskCard from '../components/tasks/TaskCard.jsx';

/**
 * Task List Page.
 * Responsibility: Full task list view (Route: `/tasks`) with pagination, search,
 * filtering, sorting, and responsive table/card layout per Section 5.3 & 5.6.
 */
export default function TaskListPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Query & pagination state
  const [keyword, setKeyword] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [page, setPage] = useState(0);
  const size = 10;

  // Deletion & notification state
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Custom data fetching hook
  const { data, loading, error, refetch } = useTasks({
    keyword,
    priority,
    status,
    sortBy,
    sortDirection,
    page,
    size,
  });

  const handleSearch = (term) => {
    setKeyword(term);
    setPage(0);
  };

  const handleFilterChange = ({ priority: p, status: s, sortBy: sb, sortDirection: sd }) => {
    setPriority(p);
    setStatus(s);
    setSortBy(sb);
    setSortDirection(sd);
    setPage(0);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setPriority('');
    setStatus('');
    setSortBy('createdAt');
    setSortDirection('desc');
    setPage(0);
  };

  const handleSortChange = (columnKey) => {
    if (sortBy === columnKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(columnKey);
      setSortDirection('asc');
    }
    setPage(0);
  };

  const handleDeletePrompt = (task) => {
    setTaskToDelete(task);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteTask(taskToDelete.id);
      setSnackbar({
        open: true,
        message: `Task "${taskToDelete.taskName}" deleted successfully.`,
        severity: 'success',
      });
      setTaskToDelete(null);
      refetch();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete task. Please try again.',
        severity: 'error',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const tasksList = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  return (
    <Box>
      {/* Page Header */}
      <PageHeader
        title="Study Tasks"
        subtitle="Manage, filter, search, and monitor all tasks in your academic schedule."
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
          title="Could not load tasks"
        />
      )}

      {/* Search & Filter Toolbar */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TaskSearchBar
          value={keyword}
          onSearch={handleSearch}
          placeholder="Search by task name or subject..."
        />

        <TaskFilterBar
          priority={priority}
          status={status}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </Paper>

      {/* Content Area: Table / Card Grid / Empty / Loading */}
      {loading && !data ? (
        <LoadingSpinner message="Fetching tasks list..." />
      ) : tasksList.length === 0 ? (
        <EmptyState
          title={keyword || priority || status ? 'No matching tasks found' : 'No tasks created yet'}
          description={
            keyword || priority || status
              ? 'Try adjusting your search criteria or resetting filters to see more tasks.'
              : 'Get started by creating your first study task with subject, priority, and deadline.'
          }
          action={
            keyword || priority || status ? (
              <Button variant="outlined" onClick={handleResetFilters}>
                Reset Filters
              </Button>
            ) : (
              <Button
                component={RouterLink}
                to="/tasks/new"
                variant="contained"
                startIcon={<AddRoundedIcon />}
              >
                Create First Task
              </Button>
            )
          }
        />
      ) : isMobile ? (
        /* Mobile View: Stacked Task Cards Grid */
        <Grid container spacing={2}>
          {tasksList.map((task) => (
            <Grid key={task.id} size={{ xs: 12, sm: 6 }}>
              <TaskCard task={task} onDelete={handleDeletePrompt} />
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Desktop View: Sortable Tasks Table */
        <TaskTable
          tasks={tasksList}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          onDelete={handleDeletePrompt}
        />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mt: 4,
            pt: 2,
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {tasksList.length} of {totalElements} tasks
          </Typography>

          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, newPage) => setPage(newPage - 1)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(taskToDelete)}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.taskName}"? This action cannot be undone.`}
        confirmText="Delete"
        severity="error"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTaskToDelete(null)}
      />

      {/* Toast Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
