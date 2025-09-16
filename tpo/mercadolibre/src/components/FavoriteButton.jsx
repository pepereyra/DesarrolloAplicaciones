import { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import './FavoriteButton.css';

function FavoriteButton({ product, size = 'medium', className = '' }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { currentUser } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isProductFavorite = isFavorite(product.id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      alert('Debes iniciar sesión para agregar favoritos');
      return;
    }

    setIsAnimating(true);
    toggleFavorite(product);
    
    // Reset animation after a short delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`favorite-button ${size} ${isProductFavorite ? 'active' : ''} ${isAnimating ? 'animating' : ''} ${className}`}
      title={isProductFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      aria-label={isProductFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <svg 
        width={size === 'small' ? '16' : size === 'large' ? '28' : '20'} 
        height={size === 'small' ? '16' : size === 'large' ? '28' : '20'} 
        viewBox="0 0 24 24" 
        fill="none"
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isProductFavorite ? 'currentColor' : 'none'}
        />
      </svg>
    </button>
  );
}

export default FavoriteButton;