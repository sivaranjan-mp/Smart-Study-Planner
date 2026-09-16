import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/MenuRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Top App Header Bar.
 * Responsibility: Persistent header containing mobile drawer toggle, brand title (on mobile),
 * and quick-action "+ Add Task" button.
 *
 * @param {Object} props
 * @param {Function} props.onDrawerToggle - Handler for mobile hamburger menu
 * @param {number} props.drawerWidth - Width of the permanent sidebar drawer on desktop
 */
export default function AppHeader({ onDrawerToggle, drawerWidth = 260 }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        zIndex: (t) => t.zIndex.drawer + (isMobile ? 0 : 1),
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open navigation drawer"
              edge="start"
              onClick={onDrawerToggle}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {isMobile && (
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <SchoolRoundedIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'text.primary',
                  letterSpacing: '-0.01em',
                }}
              >
                Study Planner
              </Typography>
            </Box>
          )}
        </Box>

        {/* Header Action Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            component={RouterLink}
            to="/tasks/new"
            variant="contained"
            color="primary"
            startIcon={<AddRoundedIcon />}
            size="small"
            sx={{
              fontWeight: 600,
              px: { xs: 1.5, sm: 2 },
              py: 0.8,
            }}
          >
            Add Task
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
