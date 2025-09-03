import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Modal,
  ImageList,
  ImageListItem,
} from '@mui/material';

// Estilos usando emotion a través de MUI styled
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: 200,
  objectFit: 'contain',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
}));

const PriceTypography = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
}));

const ShippingChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white,
  marginTop: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
  },
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 800,
  maxHeight: '90vh',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    width: '95%',
    padding: theme.spacing(2),
  },
}));

const ScrollableBox = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  maxHeight: 'calc(90vh - 64px)',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const ProductCard = ({ producto }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { nombre, precio, imagen, imagenes, descripcion, detalles, stock } = producto;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <>
      <StyledCard onClick={() => setModalOpen(true)}>
        <ProductImage
          component="img"
          image={imagen}
          alt={nombre}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h2"
            sx={{ fontWeight: 500 }}
          >
            {nombre}
          </Typography>
          <PriceTypography>
            {formatPrice(precio)}
          </PriceTypography>
          <ShippingChip
            label="Envío gratis"
            size="small"
          />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 1, fontWeight: 400 }}
          >
            Stock disponible: {stock} unidades
          </Typography>
        </CardContent>
        <Button
          variant="contained"
          sx={{ 
            m: 2,
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            // Aquí iría la lógica para agregar al carrito
          }}
        >
          Agregar al carrito
        </Button>
      </StyledCard>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{
          backdropFilter: 'blur(3px)',
        }}
      >
        <ModalContent>
          <Box sx={{ display: 'flex', gap: 4, height: '100%', overflow: 'hidden' }}>
            <ScrollableBox>
              <ImageList 
                cols={1} 
                gap={8}
                sx={{ 
                  '& .MuiImageListItem-root': {
                    overflow: 'hidden',
                    borderRadius: 1,
                  }
                }}
              >
                {imagenes.map((img, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={img}
                      alt={`${nombre} - vista ${index + 1}`}
                      loading="lazy"
                      style={{ 
                        width: '100%', 
                        objectFit: 'contain',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </ScrollableBox>
            <ScrollableBox>
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                {nombre}
              </Typography>
              <PriceTypography gutterBottom>
                {formatPrice(precio)}
              </PriceTypography>
              <ShippingChip
                label="Envío gratis"
                size="small"
              />
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 2,
                  lineHeight: 1.6,
                }}
              >
                {descripcion}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  fontWeight: 600,
                }}
              >
                Detalles del producto
              </Typography>
              {Object.entries(detalles).map(([key, value]) => (
                <Typography 
                  key={key} 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    mb: 1,
                    '&:last-child': { mb: 0 },
                  }}
                >
                  • {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                </Typography>
              ))}
              <Button
                variant="contained"
                sx={{ 
                  mt: 4, 
                  width: '100%',
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                Agregar al carrito
              </Button>
            </ScrollableBox>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductCard;