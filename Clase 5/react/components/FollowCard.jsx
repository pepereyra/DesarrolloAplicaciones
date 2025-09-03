import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

// Componentes estilizados usando Emotion
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: theme.spacing(2),
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[8],
    cursor: 'pointer',
  },
}));

const ProductImage = styled('img')({
  width: '100%',
  height: 150,
  objectFit: 'cover',
});


const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%',
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const FollowCard = ({ name, username, avatarUrl }) => {
  return (
    <StyledCard>
      <ProductImage src={avatarUrl} alt={name} />
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          @{username}
        </Typography>
        <StyledButton variant="contained" color="primary">
          Suscribirme
        </StyledButton>
      </CardContent>
    </StyledCard>
  );
};

export default FollowCard;