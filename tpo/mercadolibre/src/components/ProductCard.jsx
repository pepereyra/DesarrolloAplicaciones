import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { dispatch } = useApp();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image">
          <img src={product.thumbnail} alt={product.title} />
          {product.condition === 'new' && (
            <span className="condition-badge">Nuevo</span>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          
          <div className="product-price">
            <span className="price">{formatPrice(product.price)}</span>
            {product.installments && (
              <span className="installments">
                en {product.installments.quantity}x {formatPrice(product.installments.amount)}
              </span>
            )}
          </div>
          
          {product.free_shipping && (
            <div className="free-shipping">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16 3h5v5M4 20L20 4m0 6v6a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Envío gratis
            </div>
          )}
          
          <div className="product-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
            </svg>
            {product.location}
          </div>
          
          {product.tags && product.tags.length > 0 && (
            <div className="product-tags">
              {product.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="seller-info">
            <span className={`seller-reputation ${product.seller.reputation}`}>
              {product.seller.reputation === 'gold' && '⭐'}
              {product.seller.reputation === 'silver' && '✨'}
            </span>
            <span className="seller-name">{product.seller.nickname}</span>
          </div>
        </div>
      </Link>
      
      <button 
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        title="Agregar al carrito"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default ProductCard;
