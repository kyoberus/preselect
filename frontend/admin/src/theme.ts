// src/theme.ts
'use client';
import { createTheme } from '@mui/material/styles';
import { Kanit } from 'next/font/google';

const kanit = Kanit({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'thai'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: kanit.style.fontFamily,
  },
  palette: {
    primary: {
      main: '#FF5A5F', 
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8B5CF6', 
    },
    success: {
      main: '#10B981', 
    },
    warning: {
      main: '#FBBF24',
    },
    background: {
      default: '#F4F6F8',
      paper: '#FFFFFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;