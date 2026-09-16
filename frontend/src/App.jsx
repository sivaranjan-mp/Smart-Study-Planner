import React from 'react';
import MainLayout from './layouts/MainLayout.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

/**
 * Top-Level Application Component.
 * Responsibility: Renders MainLayout wrapping AppRoutes.
 */
function App() {
  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
}

export default App;
