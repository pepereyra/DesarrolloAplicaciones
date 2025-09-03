import React from 'react';
import { 
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  InputBase,
  Paper,
  Typography,
  ThemeProvider,
  createTheme
} from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';

import logoImage from './assets/logo.png'; 
import raybanImage from './assets/rayban.png';
import raybanImage2 from './assets/rayban2.png';
import raybanImage3 from './assets/rayban3.png';
import guantesImage from './assets/guantes.png';

// Importación del logo (ajusta la ruta según la estructura de tu proyecto)
// import logoImage from '../assets/logo.png';

// Creamos un tema personalizado con el color de fondo amarillo claro
const theme = createTheme({
  palette: {
    background: {
      default: '#fff9c4',
      paper: '#ffffff'
    },
    primary: {
      main: '#ffffff'
    }
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
  }
});

// Datos de productos de ejemplo
const products = [
  {
    id: 1,
    name: 'Anteojos De Sol Ray-ban Wayfarer RB2140 Black',
    price: '$115.012',
    image: {raybanImage}, // Ajusta según tu estructura
    shipping: 'Envío gratis'
  },
  {
    id: 2,
    name: 'Anteojos De Sol Ray-ban Wayfarer RB2140 Black',
    price: '$115.012',
    image: {raybanImage2}, // Ajusta según tu estructura
    shipping: 'Envío gratis'
  },
  {
    id: 3,
    name: 'Anteojos De Sol Ray-ban Wayfarer RB2140 Black',
    price: '$115.012',
    image: {guantesImage}, // Ajusta según tu estructura
    shipping: 'Envío gratis'
  }
];

function Ecommerce() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        bgcolor: 'background.default', 
        p: 2, 
        minHeight: '100vh',
        borderRadius: 3,
        maxWidth: '1200px',
        mx: 'auto'
      }}>
        {/* Header con logo y buscador */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
          {/* Logo - Ahora más grande */}
          <Paper 
            elevation={0} 
            sx={{ 
              width: 100, // Incrementado de 80 a 100
              height: 100, // Incrementado de 80 a 100
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0 // Evita que el logo se encoja
            }}
          >
            {/* Descomenta y ajusta según tu configuración */}
            {/* <Avatar 
              src={logoImage} 
              alt="Logo" 
              sx={{ width: 90, height: 90 }}
            /> */}
            <Typography variant="body1" color="textSecondary">
              Logo
            </Typography>
          </Paper>

          {/* Buscador - Ahora menos largo */}
          <Paper 
            component="form" 
            sx={{ 
              p: '2px 4px', 
              display: 'flex', 
              alignItems: 'center', 
              maxWidth: '500px', // Limitando el ancho máximo
              width: '60%', // Ancho relativo más pequeño
              borderRadius: 1
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="buscador"
              inputProps={{ 'aria-label': 'buscador' }}
            />
          </Paper>

          {/* Botón de búsqueda */}
          <Button 
            variant="outlined" 
            sx={{ 
              textTransform: 'none', 
              borderRadius: 1,
              bgcolor: 'white',
              color: 'black',
              borderColor: '#e0e0e0',
              '&:hover': {
                bgcolor: '#f5f5f5',
                borderColor: '#e0e0e0'
              }
            }}
          >
            buscar
          </Button>
        </Box>

        {/* Grid de productos - Cards más angostas */}
        <Grid container spacing={3} justifyContent="center">
          {products.map((product) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={product.id} 
              sx={{ maxWidth: '250px' }} // Hace que cada ítem de la grid sea más angosto
            >
              <Card sx={{ 
                borderRadius: 2, 
                boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '220px', // Cards más angostas
                mx: 'auto' // Centrado horizontal
              }}>
                <Box sx={{ p: 2, pb: 0 }}>
                  <Typography variant="caption" color="primary.main" sx={{ color: 'blue' }}>
                    Visto Recientemente
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CardMedia
                    component="img"
                    sx={{ height: 110, width: 'auto', objectFit: 'contain' }}
                    image={product.image}
                    alt={product.name}
                  />
                </Box>
                <CardContent sx={{ pt: 0, pb: 2, flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    fontSize: '0.75rem',
                    mb: 1,
                    height: '40px',
                    overflow: 'hidden'
                  }}>
                    {product.name}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    mb: 1
                  }}>
                    {product.price}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'green' }}>
                    {product.shipping}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default Ecommerce;