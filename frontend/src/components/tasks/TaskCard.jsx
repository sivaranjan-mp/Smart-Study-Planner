import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Stack,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Link as RouterLink } from 'react-router-dom';
import PriorityChip from './PriorityChip.jsx';
import StatusChip from './StatusChip.jsx';
import { formatDateTime, getRelativeTime, isOverdue } from '../../utils/dateUtils.js';

/**
 * Responsive Task Card.
 * Responsibility: Compact card for grid and mobile views of one task.
 *
 * @param {Object} props
 * @param {Object} props.task - Task entity
 * @param {Function} [props.onDelete] - Delete handler
 */
export default function TaskCard({ task, onDelete }) {
  if (!task) return null;

  const overdue = isOverdue(task.deadline, task.status);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: '#cbd5e1',
          boxShadow: '0 6px 16px -2px rgba(0, 0, 0, 0.07)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Header: Subject & Status/Priority Chips */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1.5,
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Chip
            label={task.subject}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              color: 'primary.main',
              borderColor: 'rgba(79, 70, 229, 0.3)',
              backgroundColor: 'rgba(79, 70, 229, 0.04)',
            }}
          />

          <Stack direction="row" spacing={0.75} alignItems="center">
            <PriorityChip priority={task.priority} size="small" />
            <StatusChip status={task.status} size="small" />
          </Stack>
        </Box>

        {/* Task Title */}
        <Typography
          variant="h6"
          component={RouterLink}
          to={`/tasks/${task.id}`}
          sx={{
            fontWeight: 700,
            fontSize: '1rem',
            color: 'text.primary',
            textDecoration: 'none',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
            mb: 1,
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          {task.taskName}
        </Typography>

        {/* Description */}
        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.8125rem',
              mb: 2,
              lineHeight: 1.5,
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* Deadline Footer Info */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 'auto',
            p: 1,
            borderRadius: 1.5,
            backgroundColor: overdue ? 'rgba(239, 68, 68, 0.06)' : '#f8fafc',
            border: '1px solid',
            borderColor: overdue ? 'rgba(239, 68, 68, 0.2)' : '#f1f5f9',
          }}
        >
          {overdue ? (
            <WarningAmberRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
          ) : (
            <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          )}

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                fontWeight: 600,
                color: overdue ? 'error.main' : 'text.primary',
                fontSize: '0.75rem',
                lineHeight: 1.2,
              }}
            >
              {overdue ? 'Overdue' : 'Due'}: {formatDateTime(task.deadline, 'MMM D, h:mm A')}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: overdue ? 'error.main' : 'text.secondary',
                fontSize: '0.6875rem',
              }}
            >
              {getRelativeTime(task.deadline)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Card Actions */}
      <CardActions
        sx={{
          px: 2,
          pb: 1.5,
          pt: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button
          component={RouterLink}
          to={`/tasks/${task.id}`}
          size="small"
          startIcon={<VisibilityRoundedIcon fontSize="small" />}
          sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600 }}
        >
          Details
        </Button>

        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit Task">
            <IconButton
              component={RouterLink}
              to={`/tasks/${task.id}/edit`}
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {onDelete && (
            <Tooltip title="Delete Task">
              <IconButton
                size="small"
                onClick={() => onDelete(task)}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'error.main', backgroundColor: 'rgba(239, 68, 68, 0.08)' },
                }}
              >
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
}
