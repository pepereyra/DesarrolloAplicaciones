import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import FavoriteButton from './FavoriteButton';
import './ProductCard.css';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    addToCart, 
    getItemQuantity, 
    canAddToCart, 
    formatPrice 
  } = useCart();
  const { currentUser, isProductOwner, canPurchaseProduct } = useAuth();

  const formatCompactPrice = (price) => {
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
    if (!currentUser) {
      // Guardar intención en sessionStorage y redirigir a login
      sessionStorage.setItem('pendingAddToCart', JSON.stringify({ productId: product.id }));
      navigate('/login', { state: { from: location } });
      return;
    }
    if (currentUser && !canPurchaseProduct(product.sellerId)) {
      return; // No puede comprar sus propios productos
    }
    if (canAddToCart(product)) {
      addToCart(product);
    }
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Permitir comprar aunque no haya usuario logueado
    if (currentUser && !canPurchaseProduct(product.sellerId)) {
      return; // No puede comprar sus propios productos
    }
    if (canAddToCart(product)) {
      addToCart(product);
      navigate('/carrito');
    }
  };

  const handleViewSellerProfile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Navigating to seller profile, sellerId:', product.sellerId);
    navigate(`/vendedor/${product.sellerId}`);
  };

  const handleEditProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/vender');
  };

  const isOutOfStock = product.stock === 0;
  const currentQuantity = getItemQuantity(product.id);
  const canAddMore = canAddToCart(product);
  const isOwner = currentUser && isProductOwner(product.sellerId);
  const canPurchase = !currentUser || (currentUser && canPurchaseProduct(product.sellerId));

  return (
    <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <Link to={`/producto/${product.id}`} className="product-link">
        <div className="product-image">
          <img src={product.thumbnail} alt={product.title} />
          <FavoriteButton 
            product={product} 
            size="small" 
            className="overlay"
          />
          {product.condition === 'new' && (
            <span className="condition-badge">Nuevo</span>
          )}
          {isOutOfStock && (
            <span className="stock-badge">Sin stock</span>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          
          <div className="product-price">
            <span className="price">{formatCompactPrice(product.price)}</span>
            {product.installments && (
              <span className="installments">
                en {product.installments.quantity}x {formatCompactPrice(product.installments.amount)}
              </span>
            )}
          </div>

          <div className="product-category">
            <span className="category">{product.category}</span>
          </div>

          <div className="stock-info">
            {isOutOfStock ? (
              <span className="stock-text out">Sin stock</span>
            ) : (
              <span className="stock-text available">
                Stock: {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'}
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
              {product.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {product.seller && (
            <div className="seller-info">
              <span className={`seller-reputation ${product.seller.reputation}`}>
                {product.seller.reputation === 'gold' && '⭐'}
                {product.seller.reputation === 'silver' && '✨'}
                {product.seller.reputation === 'bronze' && '🥉'}
              </span>
              <button 
                className="seller-name-btn"
                onClick={handleViewSellerProfile}
                title="Ver perfil del vendedor"
              >
                {product.seller.nickname}
              </button>
              {isOwner && (
                <span className="owner-badge">Tu producto</span>
              )}
            </div>
          )}
        </div>
      </Link>
      
      <div className="product-actions">
        {isOwner ? (
          // Botones para el propietario del producto
          <button 
            className="edit-product-btn"
            onClick={handleEditProduct}
            title="Editar producto"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <span>Editar</span>
          </button>
        ) : (
          // Botones para compradores
          <>
            <button 
              className={`add-to-cart-btn ${isOutOfStock || !canPurchase ? 'disabled' : ''} ${!canAddMore ? 'max-reached' : ''}`}
              onClick={handleAddToCart}
              disabled={isOutOfStock || (currentUser && !canPurchase) || !canAddMore}
              title={
                isOutOfStock ? "Sin stock" :
                (currentUser && !canPurchase) ? "No puedes comprar tus propios productos" :
                !canAddMore ? "Stock máximo en carrito" : "Agregar al carrito"
              }
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
              </svg>
              <span>
                {isOutOfStock ? 'Sin stock' :
                 (currentUser && !canPurchase) ? 'Tu producto' :
                 !canAddMore ? 'Máximo' : 'Agregar al carrito'}
              </span>
            </button>

            <button 
              className={`buy-now-btn ${isOutOfStock || !canPurchase ? 'disabled' : ''} ${!canAddMore ? 'max-reached' : ''}`}
              onClick={handleBuyNow}
              disabled={isOutOfStock || (currentUser && !canPurchase) || !canAddMore}
              title={
                isOutOfStock ? "Sin stock" :
                (currentUser && !canPurchase) ? "No puedes comprar tus propios productos" :
                !canAddMore ? "Stock máximo en carrito" : "Comprar ahora"
              }
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.03 0 3.89.67 5.39 1.81"/>
              </svg>
              <span>
                {isOutOfStock ? 'Sin stock' :
                 (currentUser && !canPurchase) ? 'Tu producto' :
                 !canAddMore ? 'Máximo' : 'Comprar ahora'}
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
