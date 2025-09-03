import React from 'react';
import {
    //   AppBar,
    Box,
    Avatar,
    Button,
    Card,
    CardContent,
    CardMedia,
    //   Container,
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

// Creamos un tema personalizado con el color de fondo amarillo claro
const theme = createTheme({
    palette: {
        background: {
            default: '#f9f78a',
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
        image: raybanImage,
        shipping: 'Envío gratis'
    },
    {
        id: 2,
        name: 'Guantes grises Ray-ban Wayfarer RB2140 Black',
        price: '$115.012',
        image: guantesImage,
        shipping: 'Envío gratis'
    },
    {
        id: 3,
        name: 'Anteojos De Sol Ray-ban Wayfarer RB2140 Black',
        price: '$115.012',
        image: raybanImage2,
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
                mx: 'auto',
            }}>
                {/* Header con logo y buscador */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>

                    {/* Logo */}
                    <Paper
                        elevation={0}
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography variant="body2" color="textSecondary">
                            <Box
                                component="img"
                                sx={{
                                    height: 60,
                                    width: 60,
                                    objectFit: 'contain'
                                }}
                                alt="Logo"
                                src={logoImage}
                            />
                        </Typography>
                    </Paper>

                    {/* Buscador */}
                    <Paper
                        component="form"
                        sx={{
                            p: '2px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            flexGrow: 1,
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

                {/* Grid de productos */}
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
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