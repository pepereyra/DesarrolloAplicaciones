import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import CategoryDropdown from './CategoryDropdown';
import logoML from '../assets/mercado libre.png';
import promoImage from '../assets/images.png';
import './Header.css';

function Header() {
  const { state } = useApp();
  const { currentUser, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAdmin = currentUser?.role === 'admin';
  const isAdminPanel = location.pathname === '/admin';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemsCount = state.cart.length > 0 
    ? state.cart.reduce((total, item) => total + item.quantity, 0) 
    : 0;

  if (isAdmin && isAdminPanel) {
    return (
      <header className="header admin-header">
        <div className="container">
          <div className="header-content admin">
            <Link to="/" className="logo">
              <img src="/mercado-libre-logo.svg" alt="Mercado Libre" />
              <span>Panel de Administración</span>
            </Link>
            <div className="user-actions">
              <div className="user-menu">
                <span className="user-greeting">Hola, {currentUser.firstName}</span>
                <div className="user-dropdown">
                  <Link to="/">Volver al sitio</Link>
                  <button onClick={handleLogout}>Salir</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="logo">
              <img src={logoML} alt="Mercado Libre" />
            </Link>

            {/* Buscador */}
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Buscar productos, marcas y más..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>

            {/* Anuncio */}
            <div className="promo-disney">
              <img src={promoImage} alt="Mercado Libre" />
            </div>
          </div>
        </div>
      </div>

      <div className="header-bottom">
        <div className="container">
          <div className="header-nav">
            {/* Ubicación */}
            <div className="location">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
              </svg>
              <div>
                <span className="location-label">Enviar a</span>
                <span className="location-value">Capital Federal</span>
              </div>
            </div>

            {/* Navegación */}
            <nav className="nav-menu">
              <CategoryDropdown />
              <Link to="/offers">Ofertas</Link>
              <Link to="/history">Historial</Link>
              <Link to="/supermarket">Supermercado</Link>
              <Link to="/fashion">Moda</Link>
            </nav>

            {/* Usuario y Carrito */}
            <div className="user-actions">
              {currentUser ? (
                <div className="user-menu">
                  <span className="user-greeting">Hola, {currentUser.firstName}</span>
                  <div className="user-dropdown">
                    <Link to="/profile">Mi cuenta</Link>
                    <Link to="/purchases">Mis compras</Link>
                    <Link to="/favorites">Favoritos</Link>
                    {isAdmin && (
                      <Link to="/admin">Panel Admin</Link>
                    )}
                    <button onClick={handleLogout}>Salir</button>
                  </div>
                </div>
              ) : (
                <div className="auth-links">
                  <Link to="/register">Creá tu cuenta</Link>
                  <Link to="/login">Ingresá</Link>
                </div>
              )}

              <Link to="/carrito" className="cart-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="cart-count">{cartItemsCount}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
