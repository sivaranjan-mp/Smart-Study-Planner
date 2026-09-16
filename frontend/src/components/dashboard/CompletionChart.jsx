import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  LinearProgress,
  Skeleton,
} from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

/**
 * Task Completion Progress Chart.
 * Responsibility: Visual representation of study task completion rate.
 *
 * @param {Object} props
 * @param {number} [props.percentage=0] - Completion rate from 0 to 100
 * @param {number} [props.completed=0] - Completed tasks count
 * @param {number} [props.total=0] - Total tasks count
 * @param {boolean} [props.loading=false] - Whether chart is loading
 */
export default function CompletionChart({
  percentage = 0,
  completed = 0,
  total = 0,
  loading = false,
}) {
  const roundedPercentage = Math.round(Number(percentage) || 0);

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
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CheckCircleOutlineRoundedIcon color="success" sx={{ fontSize: 22 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.0625rem' }}>
            Overall Completion Rate
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
            <Skeleton variant="circular" width={120} height={120} />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 2,
              my: 'auto',
            }}
          >
            {/* Circular Progress Gauge */}
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
              {/* Background ring */}
              <CircularProgress
                variant="determinate"
                value={100}
                size={120}
                thickness={4.5}
                sx={{ color: '#f1f5f9' }}
              />
              {/* Active progress ring */}
              <CircularProgress
                variant="determinate"
                value={roundedPercentage}
                size={120}
                thickness={4.5}
                sx={{
                  color: roundedPercentage >= 75 ? '#10b981' : roundedPercentage >= 40 ? '#4f46e5' : '#f59e0b',
                  position: 'absolute',
                  left: 0,
                  strokeLinecap: 'round',
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h5" component="div" sx={{ fontWeight: 800, lineHeight: 1 }}>
                  {roundedPercentage}%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
                  Finished
                </Typography>
              </Box>
            </Box>

            {/* Linear Bar and Ratio */}
            <Box sx={{ width: '100%', mt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Progress ({completed}/{total} tasks)
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {roundedPercentage}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={roundedPercentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#f1f5f9',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor:
                      roundedPercentage >= 75
                        ? '#10b981'
                        : roundedPercentage >= 40
                        ? '#4f46e5'
                        : '#f59e0b',
                  },
                }}
              />
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
