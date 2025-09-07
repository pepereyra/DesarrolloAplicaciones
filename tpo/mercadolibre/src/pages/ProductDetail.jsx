import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const { dispatch } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await api.getProduct(id);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_TO_CART', payload: product });
    }
    alert(`${product.title} agregado al carrito`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Redirect to cart or checkout
    window.location.href = '/cart';
  };

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

  const images = [product.thumbnail]; // In a real app, this would be an array of images

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
          {/* Galería de imágenes */}
          <div className="product-gallery">
            <div className="image-thumbnails">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`${product.title} ${index + 1}`} />
                </button>
              ))}
            </div>
            <div className="main-image">
              <img src={images[selectedImage]} alt={product.title} />
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
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input 
                  type="number" 
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  min="1"
                  max={product.stock}
                />
                <button 
                  onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <span className="stock-info">({product.stock} disponibles)</span>
            </div>

            <div className="action-buttons">
              <button 
                className="buy-now-btn"
                onClick={handleBuyNow}
              >
                Comprar ahora
              </button>
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                Agregar al carrito
              </button>
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
                <span className="seller-name">{product.seller.nickname}</span>
                <span className={`reputation ${product.seller.reputation}`}>
                  {product.seller.reputation === 'gold' && '⭐ MercadoLíder Gold'}
                  {product.seller.reputation === 'silver' && '✨ MercadoLíder'}
                </span>
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
