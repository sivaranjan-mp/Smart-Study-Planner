import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';

/**
 * Dashboard Summary Metric Card.
 * Responsibility: Displays single aggregate count/metric with icon badge and theme accent colors.
 *
 * @param {Object} props
 * @param {string} props.label - Card metric label (e.g. 'Total Tasks')
 * @param {number|string} [props.value] - Stat value
 * @param {React.ReactNode} props.icon - Icon element
 * @param {string} [props.color='#4f46e5'] - Color hex for icon background and accent
 * @param {string} [props.subtext] - Optional helper text / description
 * @param {boolean} [props.loading=false] - Whether data is loading
 */
export default function SummaryCard({
  label,
  value,
  icon,
  color = '#4f46e5',
  subtext,
  loading = false,
}) {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: '#cbd5e1',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 600, fontSize: '0.8125rem', letterSpacing: '0.01em' }}
          >
            {label}
          </Typography>

          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              backgroundColor: `${color}14`,
              color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>

        {loading ? (
          <Skeleton variant="text" width="60%" height={40} />
        ) : (
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            {value !== undefined && value !== null ? value : '—'}
          </Typography>
        )}

        {subtext && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 0.75, fontSize: '0.75rem' }}
          >
            {subtext}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
