import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsApi } from '../services/api';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    addToCart, 
    getItemQuantity, 
    canAddToCart, 
    getAvailableStock, 
    formatPrice 
  } = useCart();
  const { currentUser, isProductOwner, canPurchaseProduct } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Función para obtener las imágenes del producto
  const getProductImages = useCallback((product) => {
    if (!product) return [];
    
    const images = [];
    
    // Siempre usar el thumbnail como primera imagen si existe
    if (product.thumbnail) {
      images.push(product.thumbnail);
    }
    
    // Agregar las imágenes adicionales del array, evitando duplicar el thumbnail
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      const additionalImages = product.images.filter(img => img !== product.thumbnail);
      images.push(...additionalImages);
    }
    
    // Retornar máximo 4 imágenes
    return images.slice(0, 4);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productsApi.getProduct(id);
        setProduct(productData);
        setSelectedImage(0); // Reset imagen seleccionada al cambiar producto
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!canPurchaseProduct(product.sellerId)) {
      alert('No puedes comprar tus propios productos');
      return;
    }

    if (product.stock === 0) return;
    
    const availableStock = getAvailableStock(product);
    const maxQuantity = Math.min(quantity, availableStock);
    
    if (maxQuantity > 0) {
      addToCart(product, maxQuantity);
      alert(`${maxQuantity} ${product.title} agregado(s) al carrito`);
      setQuantity(1); // Reset quantity after adding
    } else {
      alert('No hay suficiente stock disponible');
    }
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!canPurchaseProduct(product.sellerId)) {
      alert('No puedes comprar tus propios productos');
      return;
    }

    if (product.stock === 0) return;
    
    const availableStock = getAvailableStock(product);
    const maxQuantity = Math.min(quantity, availableStock);
    
    if (maxQuantity > 0) {
      addToCart(product, maxQuantity);
      navigate('/carrito');
    } else {
      alert('No hay suficiente stock disponible');
    }
  };

  const handleEditProduct = () => {
    navigate('/vender');
  };

  const handleViewSellerProfile = () => {
    navigate(`/vendedor/${product.sellerId}`);
  };

  const handleQuantityChange = (newQuantity) => {
    const currentQuantity = getItemQuantity(product?.id || '');
    const maxAvailable = product ? product.stock - currentQuantity : 0;
    
    setQuantity(Math.max(1, Math.min(newQuantity, maxAvailable)));
  };

  // Manejo de zoom en la imagen
  const handleMouseEnter = useCallback(() => {
    setIsZoomed(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsZoomed(false);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  }, [isZoomed]);

  // Navegación de imágenes con teclado
  const handleKeyDown = useCallback((e) => {
    if (!product) return;
    
    const images = getProductImages(product);
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1);
    }
  }, [product, getProductImages]);

  // Agregar y limpiar event listeners para navegación con teclado
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Validar que selectedImage esté dentro del rango cuando cambien las imágenes
  useEffect(() => {
    if (product) {
      const images = getProductImages(product);
      if (selectedImage >= images.length) {
        setSelectedImage(0);
      }
    }
  }, [product, selectedImage, getProductImages]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Producto no encontrado</h2>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const currentQuantity = getItemQuantity(product.id);
  const availableStock = getAvailableStock(product);
  const images = getProductImages(product);

  return (
    <div className="product-detail">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span> &gt; </span>
          <Link to={`/category/${product.category}`}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Link>
          <span> &gt; </span>
          <span>{product.title}</span>
        </div>

        <div className="product-content">
          {/* Galería de imágenes mejorada */}
          <div className="product-gallery">
            <div className="image-thumbnails">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedImage(index);
                    }
                  }}
                  aria-label={`Ver imagen ${index + 1} de ${images.length}`}
                  tabIndex={0}
                >
                  <img 
                    src={img} 
                    alt={`${product.title} vista ${index + 1}`}
                    loading="lazy"
                  />
                  <div className="thumbnail-overlay"></div>
                </button>
              ))}
            </div>
            
            <div className="main-image-container">
              <div 
                className={`main-image ${isZoomed ? 'zoomed' : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                role="img"
                aria-label={`Imagen principal de ${product.title}`}
              >
                <img 
                  src={images[selectedImage]} 
                  alt={product.title}
                  loading="eager"
                  style={{
                    transformOrigin: isZoomed ? `${mousePosition.x}% ${mousePosition.y}%` : 'center',
                    transform: isZoomed ? 'scale(2.5)' : 'scale(1)'
                  }}
                />
                
                {/* Indicadores de navegación */}
                {images.length > 1 && (
                  <>
                    <button 
                      className="nav-arrow nav-arrow-left"
                      onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                      aria-label="Imagen anterior"
                      disabled={images.length <= 1}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      className="nav-arrow nav-arrow-right"
                      onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                      aria-label="Imagen siguiente"
                      disabled={images.length <= 1}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </>
                )}
                
                {/* Indicador de zoom */}
                <div className="zoom-indicator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 11H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Pasa el mouse para hacer zoom</span>
                </div>
              </div>
              
              {/* Indicadores de imagen actual */}
              {images.length > 1 && (
                <div className="image-indicators">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === selectedImage ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                      aria-label={`Ir a imagen ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Información del producto */}
          <div className="product-info">
            <div className="product-status">
              <span className={`condition ${product.condition}`}>
                {product.condition === 'new' ? 'Nuevo' : 'Usado'}
              </span>
              <span className="separator">|</span>
              <span className="stock">{product.stock} disponibles</span>
            </div>

            <h1 className="product-title">{product.title}</h1>

            <div className="product-rating">
              <div className="stars">
                ★★★★☆ <span>(4.5)</span>
              </div>
              <span className="reviews">+1000 vendidos</span>
            </div>

            <div className="product-price">
              <span className="price">{formatPrice(product.price)}</span>
              {product.installments && (
                <div className="installments">
                  <span>en {product.installments.quantity}x {formatPrice(product.installments.amount)}</span>
                  <a href="#financing" className="financing-link">Ver los medios de pago</a>
                </div>
              )}
            </div>

            {product.free_shipping && (
              <div className="shipping-info">
                <div className="free-shipping">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 3h5v5M4 20L20 4m0 6v6a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div>
                    <strong>Envío gratis</strong>
                    <p>Llega mañana</p>
                  </div>
                </div>
                <div className="location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Envío a {product.location}</span>
                </div>
              </div>
            )}

            <div className="quantity-selector">
              <label htmlFor="quantity">Cantidad:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input 
                  type="number" 
                  id="quantity"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max={availableStock}
                />
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= availableStock}
                >
                  +
                </button>
              </div>
              <span className="stock-info">
                ({availableStock} disponibles{currentQuantity > 0 && `, ${currentQuantity} en carrito`})
              </span>
            </div>

            <div className="action-buttons">
              {currentUser && isProductOwner(product.sellerId) ? (
                // Botones para el propietario del producto
                <button 
                  className="edit-product-btn"
                  onClick={handleEditProduct}
                >
                  Editar producto
                </button>
              ) : (
                // Botones para compradores
                <>
                  <button 
                    className={`buy-now-btn ${isOutOfStock || availableStock === 0 || !canPurchaseProduct(product.sellerId) ? 'disabled' : ''}`}
                    onClick={handleBuyNow}
                    disabled={isOutOfStock || availableStock === 0 || !canPurchaseProduct(product.sellerId)}
                  >
                    {!currentUser ? 'Iniciar sesión para comprar' :
                     !canPurchaseProduct(product.sellerId) ? 'Tu producto' :
                     isOutOfStock ? 'Sin stock' : 'Comprar ahora'}
                  </button>
                  <button 
                    className={`add-to-cart-btn ${isOutOfStock || availableStock === 0 || !canPurchaseProduct(product.sellerId) ? 'disabled' : ''}`}
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || availableStock === 0 || !canPurchaseProduct(product.sellerId)}
                  >
                    {!currentUser ? 'Iniciar sesión' :
                     !canPurchaseProduct(product.sellerId) ? 'Tu producto' :
                     isOutOfStock ? 'Sin stock' : 
                     availableStock === 0 ? 'Máximo en carrito' : 'Agregar al carrito'}
                  </button>
                </>
              )}
            </div>

            <div className="product-features">
              <h3>Lo que tienes que saber de este producto</h3>
              <ul>
                <li>Condición: {product.condition === 'new' ? 'Nuevo' : 'Usado'}</li>
                <li>Stock disponible: {product.stock} unidades</li>
                <li>Vendedor: {product.seller.nickname}</li>
                <li>Ubicación: {product.location}</li>
                {product.free_shipping && <li>Envío gratis a todo el país</li>}
              </ul>
            </div>
          </div>

          {/* Panel de compra */}
          <div className="purchase-panel">
            <div className="seller-info">
              <h4>Vendido por</h4>
              <div className="seller-details">
                <button 
                  className="seller-name-btn"
                  onClick={handleViewSellerProfile}
                  title="Ver perfil del vendedor"
                >
                  {product.seller.nickname}
                </button>
                <span className={`reputation ${product.seller.reputation}`}>
                  {product.seller.reputation === 'gold' && '⭐ MercadoLíder Gold'}
                  {product.seller.reputation === 'silver' && '✨ MercadoLíder'}
                  {product.seller.reputation === 'bronze' && '🥉 MercadoLíder'}
                </span>
                {currentUser && isProductOwner(product.sellerId) && (
                  <span className="owner-badge">Tu producto</span>
                )}
              </div>
              <div className="seller-stats">
                <span>+10000 ventas</span>
                <span>Excelente reputación</span>
              </div>
            </div>

            <div className="guarantee">
              <h4>Garantía</h4>
              <p>Compra Protegida con Mercado Pago</p>
              <p>Recibe el producto que esperabas o te devolvemos tu dinero</p>
            </div>

            <div className="return-policy">
              <h4>Devolución</h4>
              <p>Tienes 30 días desde que lo recibiste</p>
            </div>
          </div>
        </div>

        {/* Descripción del producto */}
        <div className="product-description">
          <h3>Descripción</h3>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
