import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Consistent Page Header.
 * Responsibility: Header displaying page title, optional subtitle, status badge,
 * and primary action CTA button across pages per Section 5.5 of architecture.
 *
 * @param {Object} props
 * @param {string|React.ReactNode} props.title - Page heading text
 * @param {string|React.ReactNode} [props.subtitle] - Supporting description text
 * @param {React.ReactNode} [props.action] - Primary CTA button or actions group
 * @param {React.ReactNode} [props.badge] - Optional badge or status chip
 * @param {React.ReactNode} [props.backButton] - Optional back navigation button
 */
export default function PageHeader({ title, subtitle, action, badge, backButton }) {
  return (
    <Box sx={{ mb: { xs: 3, sm: 4 } }}>
      {backButton && <Box sx={{ mb: 1.5 }}>{backButton}</Box>}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: { xs: '1.5rem', sm: '1.875rem' },
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </Typography>
            {badge && <Box sx={{ display: 'inline-flex' }}>{badge}</Box>}
          </Box>

          {subtitle && (
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Box>
    </Box>
  );
}
