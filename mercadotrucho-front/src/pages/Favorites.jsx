import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';
import './Favorites.css';

function Favorites() {
  const { currentUser } = useAuth();
  const { favorites, clearFavorites } = useFavorites();

  if (!currentUser) {
    return (
      <div className="favorites-page">
        <div className="container">
          <div className="favorites-login-required">
            <div className="login-prompt">
              <h2>Inicia sesión para ver tus favoritos</h2>
              <p>Guarda los productos que más te gustan para encontrarlos fácilmente</p>
              <div className="login-actions">
                <Link to="/login" className="login-btn">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="register-btn">
                  Crear cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="container">
        {/* Header */}
        <div className="favorites-header">
          <div className="header-content">
            <h1>Favoritos</h1>
            {favorites.length > 0 && (
              <span className="favorites-count">
                ({favorites.length})
              </span>
            )}
          </div>
          {favorites.length > 0 && (
            <button 
              onClick={clearFavorites}
              className="clear-favorites-btn"
            >
              Limpiar favoritos
            </button>
          )}
        </div>

        {/* Content */}
        <div className="favorites-content">
          {favorites.length === 0 ? (
            <div className="empty-favorites">
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    stroke="#999"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
              <h3>Aún no tenés productos favoritos</h3>
              <p>Agregá haciendo clic en el corazón de la página de producto.</p>
              <Link to="/" className="continue-shopping">
                Seguir comprando
              </Link>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  showFavoriteButton={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tips section when there are favorites */}
        {favorites.length > 0 && (
          <div className="favorites-tips">
            <h3>💡 Consejos sobre favoritos</h3>
            <ul>
              <li>Revisá tus favoritos regularmente para ver si hay ofertas</li>
              <li>Los productos en favoritos pueden cambiar de precio</li>
              <li>Algunos productos pueden agotarse</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;