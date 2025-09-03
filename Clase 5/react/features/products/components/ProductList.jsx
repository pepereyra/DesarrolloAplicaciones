import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ProductCard from './ProductCard';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '50vh',
});

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:3000/productos');
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        const data = await response.json();
        setProductos(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <LoadingContainer>
        <Typography color="error">{error}</Typography>
      </LoadingContainer>
    );
  }

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom component="h1">
        Productos Destacados
      </Typography>
      <Grid container spacing={3}>
        {productos.map((producto) => (
          <Grid  key={producto.id} >
            <ProductCard   producto={producto} />
          </Grid>
        ))}
      </Grid>
    </StyledContainer>
  );
};

export default ProductList;