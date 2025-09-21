import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { getSearchHistory, addSearchTerm, clearSearchHistory } from '../utils/searchHistory';
import CategoryDropdown from './CategoryDropdown';
import logoML from '../assets/mercado libre.png';
import promoImage from '../assets/images.png';
import './Header.css';

function Header() {
  const { state } = useApp();
  const { currentUser, logout } = useAuth();
  const { getFavoritesCount } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setHistoryVisible(false);
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
      // save search term per-user and navigate
      addSearchTerm(currentUser, searchTerm.trim());
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleFocus = () => {
    const hist = getSearchHistory(currentUser);
    setSuggestions(hist);
    setHistoryVisible(true);
  };

  const handleSuggestionClick = (term) => {
    setSearchTerm(term);
    setHistoryVisible(false);
    addSearchTerm(currentUser, term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleInputChange = (e) => {
    const v = e.target.value;
    setSearchTerm(v);
    if (v.trim() === '') {
      setSuggestions(getSearchHistory(currentUser));
      return;
    }
    const hist = getSearchHistory(currentUser);
    const filtered = hist.filter(h => h.toLowerCase().startsWith(v.toLowerCase()));
    setSuggestions(filtered);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemsCount = state.cart.length > 0 
    ? state.cart.reduce((total, item) => total + item.quantity, 0) 
    : 0;

  const favoritesCount = getFavoritesCount();

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
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  className="search-input"
                />
                {historyVisible && (
                  <div className="search-suggestions" role="listbox">
                    {suggestions.length === 0 ? (
                      <div className="no-suggestions">No hay búsquedas recientes</div>
                    ) : (
                      suggestions.map((s, i) => (
                        <div key={i} className="suggestion-item" onMouseDown={() => handleSuggestionClick(s)}>
                          {s}
                        </div>
                      ))
                    )}
                  </div>
                )}
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
              {currentUser && (
                <Link to="/vender" className="sell-link">
                  Vender
                </Link>
              )}
            </nav>

            {/* Usuario y Carrito */}
            <div className="user-actions">
              {currentUser ? (
                <div className="user-menu">
                  <div className="user-greeting">
                    <img 
                      src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.firstName + '+' + currentUser.lastName)}&background=3483fa&color=fff&size=32`} 
                      alt={`${currentUser.firstName} ${currentUser.lastName}`}
                      className="user-avatar"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.firstName + '+' + currentUser.lastName)}&background=3483fa&color=fff&size=32`;
                      }}
                    />
                    <span>Hola, {currentUser.firstName}</span>
                  </div>
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

              {currentUser && (
                <Link to="/favorites" className="favorites-action-link">
                  Favoritos
                  {favoritesCount > 0 && (
                    <span className="favorites-action-count">{favoritesCount}</span>
                  )}
                </Link>
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
