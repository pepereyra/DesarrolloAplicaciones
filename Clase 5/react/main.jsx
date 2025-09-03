import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, createTheme } from '@mui/material'

// Definiendo el tema global
const theme = createTheme({
  palette: {
    background: {
      default: '#f9f78a',
      paper: '#ffffff'
    },
    primary: {
      main: '#1976d2' // Color azul de Material UI
    }
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
