import React, { useState } from 'react';
import { Box, Toolbar, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader.jsx';
import AppSidebar from './AppSidebar.jsx';

const DRAWER_WIDTH = 260;

/**
 * Main Application Layout.
 * Responsibility: Persistent shell containing responsive AppHeader, AppSidebar,
 * and central Container content area per Section 5.6 of architecture.
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Optional child components or Outlet
 */
export default function MainLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Top Header Bar */}
      <AppHeader onDrawerToggle={handleDrawerToggle} drawerWidth={DRAWER_WIDTH} />

      {/* Navigation Sidebar (Permanent on Desktop, Temporary on Mobile) */}
      <AppSidebar
        mobileOpen={mobileOpen}
        onClose={handleDrawerClose}
        drawerWidth={DRAWER_WIDTH}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Spacer for fixed AppBar */}
        <Toolbar sx={{ minHeight: { xs: 64, sm: 64 } }} />

        {/* Page Content Container */}
        <Container
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            py: { xs: 3, sm: 4 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {children || <Outlet />}
        </Container>
      </Box>
    </Box>
  );
}
