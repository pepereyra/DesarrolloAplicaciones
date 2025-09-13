import { useState, useEffect, useRef } from 'react';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            <div className="search-container" ref={searchRef}>
              <button 
                className="mobile-search-button" 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Buscar"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <form className={`search-form ${isSearchOpen ? 'search-open' : ''}`} onSubmit={handleSearch}>
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
            </div>

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

            {/* Botón menú hamburguesa */}
            <button 
              className="hamburger-menu" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menú"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            {/* Navegación */}
            <nav className={`nav-menu ${isMenuOpen ? 'menu-open' : ''}`} ref={menuRef}>
              <CategoryDropdown />
              <Link to="/offers">Ofertas</Link>
              <Link to="/history">Historial</Link>
              <Link to="/supermarket">Supermercado</Link>
              <Link to="/fashion">Moda</Link>
              {currentUser && (
                <Link to="/vender" className="sell-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                  Vender
                </Link>
              )}
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
