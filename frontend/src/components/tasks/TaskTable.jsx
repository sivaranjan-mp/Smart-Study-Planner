import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Box,
  Chip,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Link as RouterLink } from 'react-router-dom';
import PriorityChip from './PriorityChip.jsx';
import StatusChip from './StatusChip.jsx';
import { formatDateTime, getRelativeTime, isOverdue } from '../../utils/dateUtils.js';

/**
 * Desktop Tasks Table.
 * Responsibility: Sortable MUI Table listing for desktop viewports per Section 5.5 & 5.6.
 *
 * @param {Object} props
 * @param {Array<Object>} props.tasks - Array of task items
 * @param {string} [props.sortBy='createdAt'] - Currently active sort field
 * @param {'asc'|'desc'} [props.sortDirection='desc'] - Currently active sort direction
 * @param {Function} [props.onSortChange] - Callback when a sortable column header is clicked
 * @param {Function} [props.onDelete] - Callback to delete a task
 */
export default function TaskTable({
  tasks = [],
  sortBy = 'createdAt',
  sortDirection = 'desc',
  onSortChange,
  onDelete,
}) {
  const handleSort = (property) => () => {
    if (onSortChange) {
      onSortChange(property);
    }
  };

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="study tasks table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, width: '30%' }}>
              <TableSortLabel
                active={sortBy === 'taskName'}
                direction={sortBy === 'taskName' ? sortDirection : 'asc'}
                onClick={handleSort('taskName')}
              >
                Task Name
              </TableSortLabel>
            </TableCell>

            <TableCell sx={{ fontWeight: 700, width: '15%' }}>
              <TableSortLabel
                active={sortBy === 'subject'}
                direction={sortBy === 'subject' ? sortDirection : 'asc'}
                onClick={handleSort('subject')}
              >
                Subject
              </TableSortLabel>
            </TableCell>

            <TableCell sx={{ fontWeight: 700, width: '12%' }}>
              <TableSortLabel
                active={sortBy === 'priority'}
                direction={sortBy === 'priority' ? sortDirection : 'asc'}
                onClick={handleSort('priority')}
              >
                Priority
              </TableSortLabel>
            </TableCell>

            <TableCell sx={{ fontWeight: 700, width: '13%' }}>
              <TableSortLabel
                active={sortBy === 'status'}
                direction={sortBy === 'status' ? sortDirection : 'asc'}
                onClick={handleSort('status')}
              >
                Status
              </TableSortLabel>
            </TableCell>

            <TableCell sx={{ fontWeight: 700, width: '18%' }}>
              <TableSortLabel
                active={sortBy === 'deadline'}
                direction={sortBy === 'deadline' ? sortDirection : 'asc'}
                onClick={handleSort('deadline')}
              >
                Deadline
              </TableSortLabel>
            </TableCell>

            <TableCell align="right" sx={{ fontWeight: 700, width: '12%' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tasks.map((task) => {
            const overdue = isOverdue(task.deadline, task.status);

            return (
              <TableRow
                key={task.id}
                hover
                sx={{
                  transition: 'background-color 0.15s ease-in-out',
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                {/* Task Name & Description */}
                <TableCell>
                  <Typography
                    component={RouterLink}
                    to={`/tasks/${task.id}`}
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      textDecoration: 'none',
                      display: 'block',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {task.taskName}
                  </Typography>
                  {task.description && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mt: 0.25,
                      }}
                    >
                      {task.description}
                    </Typography>
                  )}
                </TableCell>

                {/* Subject */}
                <TableCell>
                  <Chip
                    label={task.subject}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      color: 'primary.main',
                      borderColor: 'rgba(79, 70, 229, 0.25)',
                      backgroundColor: 'rgba(79, 70, 229, 0.03)',
                    }}
                  />
                </TableCell>

                {/* Priority */}
                <TableCell>
                  <PriorityChip priority={task.priority} size="small" />
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusChip status={task.status} size="small" />
                </TableCell>

                {/* Deadline */}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    {overdue && (
                      <Tooltip title="Overdue Task">
                        <WarningAmberRoundedIcon sx={{ fontSize: 16, color: 'error.main' }} />
                      </Tooltip>
                    )}
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.8125rem',
                          fontWeight: overdue ? 700 : 500,
                          color: overdue ? 'error.main' : 'text.primary',
                        }}
                      >
                        {formatDateTime(task.deadline, 'MMM D, YYYY, h:mm A')}
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
                </TableCell>

                {/* Actions */}
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="View Details">
                      <IconButton
                        component={RouterLink}
                        to={`/tasks/${task.id}`}
                        size="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        <VisibilityRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

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
                            '&:hover': {
                              color: 'error.main',
                              backgroundColor: 'rgba(239, 68, 68, 0.08)',
                            },
                          }}
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
