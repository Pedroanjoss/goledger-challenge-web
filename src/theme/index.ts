import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark', 
    background: {
      default: '#0B0F19', 
      paper: '#1A202C',   
    },
    primary: {
      main: '#3B82F6', 
    },
    text: {
      primary: '#F9FAFB', 
      secondary: '#9CA3AF', 
    },
    error: {
      main: '#EF4444', 
    },
    success: {
      main: '#10B981', 
    }
  },
  shape: {
    borderRadius: 12, 
  },
  typography: {
    
    h3: { fontWeight: 800 },
    h6: { fontWeight: 700 },
  },
});