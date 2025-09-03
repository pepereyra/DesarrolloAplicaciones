import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import ProductList from './features/products/components/ProductList';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2D3277',
    },
    secondary: {
      main: '#00a650',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProductList />
      
    </ThemeProvider>

    
  );
}

export default App;
