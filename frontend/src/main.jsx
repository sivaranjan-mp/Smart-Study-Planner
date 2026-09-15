import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

/**
 * Frontend Root Entry Point.
 * Responsibility: Mounts React application, wraps with ThemeProvider, CssBaseline, and BrowserRouter.
 */

// TODO: Wrap App with BrowserRouter, ThemeProvider, and CssBaseline
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
