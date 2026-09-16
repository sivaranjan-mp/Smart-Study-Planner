import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  Stack,
  Skeleton,
} from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import { Link as RouterLink } from 'react-router-dom';
import PriorityChip from '../tasks/PriorityChip.jsx';
import { formatDateTime, getRelativeTime, isOverdue } from '../../utils/dateUtils.js';

/**
 * Upcoming Deadlines List Widget.
 * Responsibility: Displays nearest-deadline tasks with countdown timers and details links.
 *
 * @param {Object} props
 * @param {Array<Object>} [props.tasks=[]] - Array of nearest deadline tasks
 * @param {boolean} [props.loading=false] - Loading state
 */
export default function UpcomingDeadlinesList({ tasks = [], loading = false }) {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 3, pb: 1, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeRoundedIcon color="primary" sx={{ fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.0625rem' }}>
              Upcoming Deadlines
            </Typography>
          </Box>

          <Button
            component={RouterLink}
            to="/tasks"
            size="small"
            endIcon={<ArrowForwardRoundedIcon fontSize="small" />}
            sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem' }}
          >
            All Tasks
          </Button>
        </Box>

        {loading ? (
          <Stack spacing={2} sx={{ py: 1 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rounded" height={60} />
            ))}
          </Stack>
        ) : tasks.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 5,
              textAlign: 'center',
            }}
          >
            <EventAvailableRoundedIcon sx={{ fontSize: 36, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              No upcoming deadlines!
            </Typography>
            <Typography variant="caption" color="text.secondary">
              You are all caught up on your study schedule.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {tasks.map((task, index) => {
              const overdue = isOverdue(task.deadline, task.status);

              return (
                <React.Fragment key={task.id}>
                  {index > 0 && <Divider sx={{ my: 1 }} />}
                  <ListItem
                    disableGutters
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      gap: 2,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          component={RouterLink}
                          to={`/tasks/${task.id}`}
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            textDecoration: 'none',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            '&:hover': { color: 'primary.main' },
                          }}
                        >
                          {task.taskName}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
                            {task.subject}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            •
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: overdue ? 'error.main' : 'text.secondary',
                              fontWeight: overdue ? 700 : 500,
                            }}
                          >
                            {formatDateTime(task.deadline, 'MMM D, h:mm A')} ({getRelativeTime(task.deadline)})
                          </Typography>
                        </Box>
                      }
                    />

                    <PriorityChip priority={task.priority} size="small" />
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
