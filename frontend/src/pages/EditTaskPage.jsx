import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import useTask from '../hooks/useTask.js';
import { updateTask } from '../services/taskService.js';
import PageHeader from '../components/common/PageHeader.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorBanner from '../components/common/ErrorBanner.jsx';
import TaskForm from '../components/tasks/TaskForm.jsx';

/**
 * Edit Task Page.
 * Responsibility: Edit Task view (Route: `/tasks/:id/edit`) fetching existing task data,
 * rendering controlled TaskForm in edit mode, and updating via PUT /api/tasks/{id}.
 */
export default function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: task, loading, error: fetchError, refetch } = useTask(id);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const handleUpdateTask = async (payload) => {
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      await updateTask(id, payload);
      navigate(`/tasks/${id}`);
    } catch (err) {
      setUpdateError(err);
      setUpdateLoading(false);
    }
  };

  if (loading && !task) {
    return <LoadingSpinner message={`Loading task #${id} for editing...`} />;
  }

  if (fetchError || !task) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <PageHeader
          title="Edit Task"
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
          error={fetchError || 'Task not found or has been removed.'}
          onRetry={refetch}
          title="Could not load task for editing"
        />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Page Header */}
      <PageHeader
        title={`Edit Task: ${task.taskName}`}
        subtitle={`Update subject, priority, deadline, status, or description for task #${id}.`}
        backButton={
          <Button
            component={RouterLink}
            to={`/tasks/${id}`}
            startIcon={<ArrowBackRoundedIcon />}
            size="small"
            sx={{ color: 'text.secondary', fontWeight: 500 }}
          >
            Back to Details
          </Button>
        }
      />

      {/* Update Error Alert */}
      {updateError && (
        <ErrorBanner
          error={updateError}
          title="Failed to update task"
        />
      )}

      {/* Controlled Edit Task Form */}
      <TaskForm
        initialValues={task}
        onSubmit={handleUpdateTask}
        loading={updateLoading}
        isEdit={true}
        onCancel={() => navigate(`/tasks/${id}`)}
      />
    </Box>
  );
}
