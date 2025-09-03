import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  TextField,
  LinearProgress,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: '8px'
}));

const ProductImage = styled('img')({
  width: '80px',
  height: '80px',
  objectFit: 'contain'
});

const Cart = () => {
  const [cartItem] = useState({
    id: 1,
    name: "Ups + Estabilizador Lyonn Ctb 800va 480w Con Soft...",
    price: 107250,
    quantity: 1,
    stock: 50,
    image: "/assets/ups.jpg"
  });

  const [quantity, setQuantity] = useState(1);

  const handleQuantity = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= cartItem.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* Columna izquierda - Productos */}
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Checkbox />
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Productos FULL
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, p: 2, alignItems: 'center' }}>
              <ProductImage src={cartItem.image} alt={cartItem.name} />
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {cartItem.name}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Link component="button" sx={{ color: '#3483fa' }}>
                    Eliminar
                  </Link>
                  <Link component="button" sx={{ color: '#3483fa' }}>
                    Guardar
                  </Link>
                  <Link component="button" sx={{ color: '#3483fa' }}>
                    Comprar ahora
                  </Link>
                </Box>
                
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  +{cartItem.stock} disponibles
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton size="small" onClick={() => handleQuantity(-1)}>
                </IconButton>
                <Typography>{quantity}</Typography>
              </Box>

              <Box>
                <Typography variant="body1" color="textSecondary" sx={{ textDecoration: 'line-through' }}>
                  $ {(cartItem.price * 1.2).toFixed(0)}
                </Typography>
                <Typography variant="h6">
                  $ {cartItem.price.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="body2" color="primary">
                Envío gratis
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={100} 
                sx={{ 
                  mt: 1, 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#00a650'
                  }
                }} 
              />
            </Box>
          </StyledPaper>
        </Grid>

        {/* Columna derecha - Resumen */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Resumen de compra
            </Typography>
            
            <Box sx={{ my: 2 }}>
              <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Grid item>
                  <Typography>Producto</Typography>
                </Grid>
                <Grid item>
                  <Typography>$ {cartItem.price.toLocaleString()}</Typography>
                </Grid>
              </Grid>
              
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography>Envío</Typography>
                </Grid>
                <Grid item>
                  <Typography color="success.main">Gratis</Typography>
                </Grid>
              </Grid>
            </Box>

            <TextField
              fullWidth
              size="small"
              placeholder="Ingresar código de cupón"
              sx={{ mb: 2 }}
            />

            <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
              <Grid item>
                <Typography variant="h6">Total</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  $ {cartItem.price.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>

            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: '#3483fa',
                '&:hover': {
                  bgcolor: '#2968c8'
                }
              }}
            >
              Continuar compra
            </Button>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;