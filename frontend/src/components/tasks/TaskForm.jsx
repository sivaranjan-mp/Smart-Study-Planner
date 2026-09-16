import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import dayjs from 'dayjs';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../../utils/constants.js';
import { validateTaskForm } from '../../utils/validators.js';

const getInitialFormState = (initialValues) => ({
  taskName: initialValues?.taskName || '',
  subject: initialValues?.subject || '',
  description: initialValues?.description || '',
  priority: initialValues?.priority || 'MEDIUM',
  deadline: initialValues?.deadline
    ? dayjs(initialValues.deadline)
    : dayjs().add(1, 'day').set('hour', 17).set('minute', 0).set('second', 0),
  status: initialValues?.status || 'PENDING',
});

/**
 * Shared Task Create & Edit Form.
 * Responsibility: Controlled form with real-time Bean Validation mirroring,
 * DateTimePicker integration, and submission handling per Section 4.2 & 5.2.
 *
 * @param {Object} props
 * @param {Object} [props.initialValues] - Initial task data for edit mode
 * @param {Function} props.onSubmit - Submit handler receiving validated payload
 * @param {boolean} [props.loading=false] - Submission in-flight state
 * @param {boolean} [props.isEdit=false] - Whether form is in edit mode
 * @param {Function} [props.onCancel] - Cancel callback
 */
export default function TaskForm({
  initialValues,
  onSubmit,
  loading = false,
  isEdit = false,
  onCancel,
}) {
  const [formData, setFormData] = useState(() => getInitialFormState(initialValues));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const fieldErrors = validateTaskForm({ ...formData, [field]: value }, isEdit);
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validateTaskForm(formData, isEdit);
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
  };

  const handleDeadlineChange = (newDate) => {
    setFormData((prev) => ({ ...prev, deadline: newDate }));
    if (touched.deadline) {
      const fieldErrors = validateTaskForm({ ...formData, deadline: newDate }, isEdit);
      setErrors((prev) => ({ ...prev, deadline: fieldErrors.deadline }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      taskName: true,
      subject: true,
      description: true,
      priority: true,
      deadline: true,
      status: true,
    });

    const validationErrors = validateTaskForm(formData, isEdit);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Format ISO deadline string for backend
    const payload = {
      taskName: formData.taskName.trim(),
      subject: formData.subject.trim(),
      description: formData.description?.trim() || null,
      priority: formData.priority,
      deadline: formData.deadline?.toISOString() || formData.deadline,
      ...(isEdit ? { status: formData.status } : {}),
    };

    onSubmit?.(payload);
  };

  return (
    <Paper
      elevation={0}
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        p: { xs: 2.5, sm: 4 },
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
      }}
    >
      <Grid container spacing={3}>
        {/* Task Name */}
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            fullWidth
            id="taskName"
            name="taskName"
            label="Task Name"
            placeholder="e.g. Complete Calculus Problem Set 3"
            value={formData.taskName}
            onChange={handleChange('taskName')}
            onBlur={handleBlur('taskName')}
            error={Boolean(touched.taskName && errors.taskName)}
            helperText={(touched.taskName && errors.taskName) || 'Max 150 characters'}
            slotProps={{
              htmlInput: { maxLength: 150 },
            }}
          />
        </Grid>

        {/* Subject */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            id="subject"
            name="subject"
            label="Subject"
            placeholder="e.g. Mathematics, Physics, CS"
            value={formData.subject}
            onChange={handleChange('subject')}
            onBlur={handleBlur('subject')}
            error={Boolean(touched.subject && errors.subject)}
            helperText={(touched.subject && errors.subject) || 'Max 100 characters'}
            slotProps={{
              htmlInput: { maxLength: 100 },
            }}
          />
        </Grid>

        {/* Priority */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl
            required
            fullWidth
            error={Boolean(touched.priority && errors.priority)}
          >
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              id="priority"
              value={formData.priority}
              label="Priority"
              onChange={handleChange('priority')}
              onBlur={handleBlur('priority')}
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            {touched.priority && errors.priority && (
              <FormHelperText>{errors.priority}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Deadline Picker */}
        <Grid size={{ xs: 12, sm: isEdit ? 6 : 12 }}>
          <DateTimePicker
            label="Deadline *"
            value={formData.deadline}
            onChange={handleDeadlineChange}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                onBlur: handleBlur('deadline'),
                error: Boolean(touched.deadline && errors.deadline),
                helperText: touched.deadline && errors.deadline,
              },
            }}
          />
        </Grid>

        {/* Status (Edit Mode Only) */}
        {isEdit && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl
              required
              fullWidth
              error={Boolean(touched.status && errors.status)}
            >
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={formData.status}
                label="Status"
                onChange={handleChange('status')}
                onBlur={handleBlur('status')}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              {touched.status && errors.status && (
                <FormHelperText>{errors.status}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        )}

        {/* Description */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            id="description"
            name="description"
            label="Description (Optional)"
            placeholder="Add relevant notes, chapters, topics, or reference links..."
            value={formData.description}
            onChange={handleChange('description')}
            onBlur={handleBlur('description')}
            error={Boolean(touched.description && errors.description)}
            helperText={(touched.description && errors.description) || `${formData.description?.length || 0}/1000 characters`}
            slotProps={{
              htmlInput: { maxLength: 1000 },
            }}
          />
        </Grid>

        {/* Form Actions */}
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 2,
              pt: 2,
              borderTop: '1px solid #f1f5f9',
            }}
          >
            {onCancel && (
              <Button
                variant="outlined"
                color="inherit"
                onClick={onCancel}
                disabled={loading}
                sx={{ borderColor: '#cbd5e1', color: 'text.secondary' }}
              >
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={16} color="inherit" /> : <SaveRoundedIcon />
              }
              sx={{ minWidth: 130 }}
            >
              {loading ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
