import { createTheme, alpha } from '@mui/material/styles';

/**
 * Material UI Custom Theme Configuration.
 * Responsibility: Single source of visual truth — color palette, typography scale,
 * shape metrics, and component style overrides per Section 5.5 of architecture.
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5', // Modern Indigo brand
      light: '#818cf8',
      dark: '#3730a3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06b6d4', // Vibrant Cyan accent
      light: '#67e8f9',
      dark: '#0e7490',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981', // Emerald - Completed / Low Priority
      light: '#d1fae5',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b', // Amber - In Progress / Medium Priority
      light: '#fef3c7',
      dark: '#d97706',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444', // Rose/Red - High Priority / Destructive
      light: '#fee2e2',
      dark: '#dc2626',
      contrastText: '#ffffff',
    },
    info: {
      main: '#3b82f6', // Blue - Pending / Informational
      light: '#dbeafe',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Crisp Slate 50
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a', // Slate 900
      secondary: '#64748b', // Slate 500
      disabled: '#94a3b8', // Slate 400
    },
    divider: '#e2e8f0', // Slate 200
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#475569',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#64748b',
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.84375rem',
      lineHeight: 1.5,
      color: '#64748b',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8fafc',
          color: '#0f172a',
          scrollBehavior: 'smooth',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.15s ease-in-out',
        },
        containedPrimary: {
          boxShadow: '0 1px 2px 0 rgba(79, 70, 229, 0.2)',
          '&:hover': {
            backgroundColor: '#4338ca',
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)',
          },
        },
        outlined: {
          borderColor: '#cbd5e1',
          '&:hover': {
            borderColor: '#94a3b8',
            backgroundColor: alpha('#f1f5f9', 0.5),
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation0: {
          boxShadow: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
          transition: 'box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#0f172a',
          boxShadow: 'none',
          borderBottom: '1px solid #e2e8f0',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          boxSizing: 'border-box',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          padding: '8px 12px',
          transition: 'background-color 0.15s ease-in-out, color 0.15s ease-in-out',
          '&.Mui-selected': {
            backgroundColor: alpha('#4f46e5', 0.08),
            color: '#4f46e5',
            '&:hover': {
              backgroundColor: alpha('#4f46e5', 0.14),
            },
            '& .MuiListItemIcon-root': {
              color: '#4f46e5',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 14,
          padding: '8px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8fafc',
          '& .MuiTableCell-root': {
            fontWeight: 600,
            color: '#475569',
            fontSize: '0.8125rem',
            borderBottom: '1px solid #e2e8f0',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#f1f5f9',
        },
      },
    },
  },
});

export default theme;
