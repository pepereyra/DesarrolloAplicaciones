import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import './SellerProfile.css';

function SellerProfile() {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('SellerProfile component loaded with sellerId:', sellerId);

  useEffect(() => {
    const loadSellerData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Loading seller data for sellerId:', sellerId);

        // Cargar datos del vendedor
        const usersResponse = await fetch(`http://localhost:3000/users/${sellerId}`);
        if (!usersResponse.ok) {
          throw new Error('Vendedor no encontrado');
        }
        const sellerData = await usersResponse.json();
        console.log('Seller data loaded:', sellerData);
        setSeller(sellerData);

        // Cargar productos del vendedor
        const allProducts = await api.getProducts();
        const vendorProducts = allProducts.filter(product => product.sellerId === sellerId);
        console.log('Vendor products found:', vendorProducts.length);
        setSellerProducts(vendorProducts);

      } catch (error) {
        console.error('Error loading seller data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      loadSellerData();
    }
  }, [sellerId]);

  if (loading) {
    return (
      <div className="seller-profile-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando perfil del vendedor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-profile-error">
        <div className="error-content">
          <h2>Vendedor no encontrado</h2>
          <p>{error}</p>
          <Link to="/" className="back-home-btn">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="seller-profile-error">
        <div className="error-content">
          <h2>Vendedor no encontrado</h2>
          <p>El vendedor que buscas no existe.</p>
          <Link to="/" className="back-home-btn">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const { sellerProfile } = seller;
  const reputationInfo = {
    gold: { text: 'MercadoLíder Gold', icon: '⭐', color: '#f1c40f' },
    silver: { text: 'MercadoLíder', icon: '✨', color: '#95a5a6' },
    bronze: { text: 'MercadoLíder Bronze', icon: '🥉', color: '#cd7f32' }
  };

  const reputation = reputationInfo[sellerProfile?.reputation] || reputationInfo.bronze;

  return (
    <div className="seller-profile">
      <div className="container">
        {/* Header del perfil */}
        <div className="seller-header">
          <div className="seller-avatar">
            <img 
              src={seller.avatar || 'https://via.placeholder.com/120'} 
              alt={`Avatar de ${seller.firstName}`}
            />
          </div>
          
          <div className="seller-info">
            <div className="seller-name-reputation">
              <h1>{sellerProfile?.nickname || `${seller.firstName} ${seller.lastName}`}</h1>
              <div className="reputation-badge" style={{ color: reputation.color }}>
                <span className="reputation-icon">{reputation.icon}</span>
                <span className="reputation-text">{reputation.text}</span>
              </div>
            </div>
            
            <div className="seller-details">
              <div className="detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{sellerProfile?.location || 'Argentina'}</span>
              </div>
              
              <div className="detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="M21 15l-3.086-3.086a2 2 0 00-2.828 0L6 21"/>
                </svg>
                <span>{sellerProducts.length} productos en venta</span>
              </div>
              
              <div className="detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
                <span>Vendedor desde {new Date(seller.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {sellerProfile?.description && (
              <div className="seller-description">
                <p>{sellerProfile.description}</p>
              </div>
            )}

            <div className="seller-stats">
              <div className="stat-item">
                <span className="stat-number">+1000</span>
                <span className="stat-label">Ventas</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">Positivas</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24h</span>
                <span className="stat-label">Responde en</span>
              </div>
            </div>
          </div>
        </div>

        {/* Productos del vendedor */}
        <div className="seller-products">
          <div className="products-header">
            <h2>Productos de {sellerProfile?.nickname || seller.firstName}</h2>
            <span className="products-count">({sellerProducts.length} productos)</span>
          </div>

          {sellerProducts.length > 0 ? (
            <div className="products-grid">
              {sellerProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <div className="no-products-content">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h3>Este vendedor no tiene productos disponibles</h3>
                <p>Vuelve pronto para ver nuevos productos</p>
                <Link to="/" className="browse-products-btn">
                  Explorar otros productos
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Información de contacto (si está disponible) */}
        {sellerProfile?.phone && (
          <div className="seller-contact">
            <h3>Información de contacto</h3>
            <div className="contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
              <span>{sellerProfile.phone}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerProfile;