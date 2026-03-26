import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#980755',
        dark: '#7a0544',
        light: '#b81a6e',
        contrastText: '#fff',
      },
      secondary: {
        main: '#980755',
        contrastText: '#fff',
      },
      background: {
        default: mode === 'light' ? '#F9FAFB' : '#121212',
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          containedPrimary: {
            backgroundColor: '#980755',
            '&:hover': {
              backgroundColor: '#7a0544',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
            color: mode === 'light' ? '#333' : '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
            borderRight: mode === 'light' ? '1px solid #E5E7EB' : '1px solid #333',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          },
        },
      },
    },
  });
