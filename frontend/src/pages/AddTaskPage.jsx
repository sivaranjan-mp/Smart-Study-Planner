import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { createTask } from '../services/taskService.js';
import PageHeader from '../components/common/PageHeader.jsx';
import ErrorBanner from '../components/common/ErrorBanner.jsx';
import TaskForm from '../components/tasks/TaskForm.jsx';

/**
 * Add Task Page.
 * Responsibility: Create Task view (Route: `/tasks/new`) rendering controlled TaskForm,
 * validating payload, and calling backend POST /api/tasks.
 */
export default function AddTaskPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateTask = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const created = await createTask(payload);
      // Navigate to detail page of created task or task list
      if (created?.id) {
        navigate(`/tasks/${created.id}`);
      } else {
        navigate('/tasks');
      }
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Page Header */}
      <PageHeader
        title="Create New Task"
        subtitle="Specify subject, priority, deadline, and description for your study plan."
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
      />

      {/* Error Alert */}
      {error && (
        <ErrorBanner
          error={error}
          title="Failed to create task"
        />
      )}

      {/* Controlled Create Task Form */}
      <TaskForm
        onSubmit={handleCreateTask}
        loading={loading}
        isEdit={false}
        onCancel={() => navigate('/tasks')}
      />
    </Box>
  );
}
