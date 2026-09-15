import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Paper,
  IconButton,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const navItems = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <DashboardRoundedIcon fontSize="small" />,
    matchExact: true,
  },
  {
    label: 'Task List',
    path: '/tasks',
    icon: <AssignmentRoundedIcon fontSize="small" />,
    matchExact: true,
  },
  {
    label: 'Add Task',
    path: '/tasks/new',
    icon: <AddCircleOutlineRoundedIcon fontSize="small" />,
    matchExact: true,
  },
];

/**
 * Navigation Sidebar.
 * Responsibility: Responsive drawer navigation per Section 5.6 of architecture.
 * Permanent drawer on desktop (md+), temporary overlay drawer on mobile (xs/sm).
 *
 * @param {Object} props
 * @param {boolean} props.mobileOpen - State of mobile drawer
 * @param {Function} props.onClose - Mobile drawer close handler
 * @param {number} props.drawerWidth - Width of the drawer in pixels
 */
export default function AppSidebar({ mobileOpen, onClose, drawerWidth = 260 }) {
  const location = useLocation();

  const isItemActive = (item) => {
    if (item.matchExact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          component={RouterLink}
          to="/"
          onClick={onClose}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 4px rgba(79, 70, 229, 0.25)',
            }}
          >
            <SchoolRoundedIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                lineHeight: 1.2,
                color: 'text.primary',
              }}
            >
              Study Planner
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              Task Management
            </Typography>
          </Box>
        </Box>

        {/* Mobile Close Button */}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ display: { xs: 'flex', md: 'none' }, color: 'text.secondary' }}
          aria-label="close navigation drawer"
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Navigation Links */}
      <Box sx={{ flexGrow: 1, py: 2 }}>
        <Typography
          variant="caption"
          sx={{
            px: 3,
            pb: 1,
            display: 'block',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'text.secondary',
            fontSize: '0.7rem',
          }}
        >
          Menu
        </Typography>
        <List disablePadding>
          {navItems.map((item) => {
            const active = isItemActive(item);
            return (
              <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  onClick={onClose}
                  selected={active}
                  sx={{
                    my: 0.5,
                    mx: 1.5,
                    borderRadius: 2,
                    py: 1,
                    px: 1.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: active ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: active ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer Info Box */}
      <Box sx={{ p: 2, m: 1.5 }}>
        <Paper
          variant="outlined"
          sx={{
            p: 1.75,
            borderRadius: 2,
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
              Planner v1.0
            </Typography>
            <Chip
              label="Phase 5"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 600 }}
            />
          </Box>
          <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            Frontend Foundation Ready
          </Typography>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="application navigation folders"
    >
      {/* Mobile temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
