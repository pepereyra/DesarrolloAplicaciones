import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import './Home.css';

function Home() {
  const { state, dispatch } = useApp();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const products = await api.getProducts();
        dispatch({ type: 'SET_PRODUCTS', payload: products });
        
        // Productos destacados (primeros 6)
        setFeaturedProducts(products.slice(0, 6));
        
        // Categorías únicas
        const uniqueCategories = [...new Set(products.map(p => p.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchData();
  }, [dispatch]);

  if (state.loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Banner principal */}
      <section className="hero-banner">
        <div className="container">
          <div className="banner-content">
            <div className="banner-main">
              <img 
                src="https://via.placeholder.com/800x300/3483fa/ffffff?text=Ofertas+Especiales" 
                alt="Banner principal" 
                className="banner-image"
              />
            </div>
            <div className="banner-sidebar">
              <div className="promo-card">
                <img 
                  src="https://via.placeholder.com/200x100/fff159/333333?text=Descuentos" 
                  alt="Descuentos" 
                />
              </div>
              <div className="promo-card">
                <img 
                  src="https://via.placeholder.com/200x100/00a650/ffffff?text=Envío+Gratis" 
                  alt="Envío gratis" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="categories-section">
        <div className="container">
          <h2>Categorías</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <Link 
                key={category} 
                to={`/category/${category}`}
                className="category-card"
              >
                <div className="category-icon">
                  {getCategoryIcon(category)}
                </div>
                <span className="category-name">
                  {getCategoryName(category)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Productos destacados</h2>
            <Link to="/products" className="see-all">Ver todos</Link>
          </div>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Ofertas del día */}
      <section className="offers-section">
        <div className="container">
          <h2>Ofertas del día</h2>
          <div className="offers-banner">
            <div className="offer-content">
              <h3>¡Hasta 50% OFF en productos seleccionados!</h3>
              <p>Aprovechá las mejores ofertas por tiempo limitado</p>
              <Link to="/offers" className="cta-button">Ver ofertas</Link>
            </div>
            <div className="offer-image">
              <img 
                src="https://via.placeholder.com/300x200/ff6b35/ffffff?text=50%+OFF" 
                alt="Ofertas del día" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 3h5v5M4 20L20 4m0 6v6a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4>Envío gratis</h4>
              <p>En miles de productos</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4>Compra protegida</h4>
              <p>Recibí el producto que esperás o te devolvemos tu dinero</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4>Pagá como quieras</h4>
              <p>Tarjetas de crédito o débito, efectivo, Mercado Pago</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function getCategoryIcon(category) {
  const icons = {
    celulares: '📱',
    computacion: '💻',
    electrodomesticos: '🔌',
    deportes: '⚽',
    audio: '🎧',
    default: '🏷️'
  };
  return icons[category] || icons.default;
}

function getCategoryName(category) {
  const names = {
    celulares: 'Celulares',
    computacion: 'Computación',
    electrodomesticos: 'Electrodomésticos',
    deportes: 'Deportes',
    audio: 'Audio',
  };
  return names[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

export default Home;
