import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import './Search.css';

function Search() {
  const { state, dispatch } = useApp();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    condition: '',
    category: '',
    freeShipping: false,
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) return;
      
      setLoading(true);
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const products = await api.searchProducts(query);
        // Ensure search respects the query: only include products whose title or description
        // include the query string (case-insensitive). Do not fall back to unrelated products.
        const q = query.trim().toLowerCase();
        let filteredResults = products.filter(p => (
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
        ));

        // Apply filters
        if (filters.condition) {
          filteredResults = filteredResults.filter(p => p.condition === filters.condition);
        }
        
        if (filters.category) {
          filteredResults = filteredResults.filter(p => p.category === filters.category);
        }
        
        if (filters.freeShipping) {
          filteredResults = filteredResults.filter(p => p.free_shipping);
        }
        
        if (filters.minPrice) {
          filteredResults = filteredResults.filter(p => p.price >= parseInt(filters.minPrice));
        }
        
        if (filters.maxPrice) {
          filteredResults = filteredResults.filter(p => p.price <= parseInt(filters.maxPrice));
        }

        // Apply sorting
        switch (sortBy) {
          case 'price_low':
            filteredResults.sort((a, b) => a.price - b.price);
            break;
          case 'price_high':
            filteredResults.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
            // In a real app, you would sort by creation date
            break;
          default:
            // relevance - keep original order
            break;
        }

        setResults(filteredResults);
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: filteredResults });
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setLoading(false);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    searchProducts();
  }, [query, filters, sortBy, dispatch]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      condition: '',
      category: '',
      freeShipping: false,
      minPrice: '',
      maxPrice: ''
    });
  };

  // Get unique categories from results
  const categories = [...new Set(results.map(p => p.category))];

  if (!query) {
    return (
      <div className="search-page">
        <div className="container">
          <div className="no-query">
            <h2>Ingresa un término de búsqueda</h2>
            <p>Usa el buscador para encontrar productos</p>
            <Link to="/" className="back-home">Volver al inicio</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-header">
          <h1>Resultados para "{query}"</h1>
          <span className="results-count">
            {loading ? 'Buscando...' : `${results.length} resultado${results.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        <div className="search-content">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h3>Filtros</h3>
              <button onClick={clearFilters} className="clear-filters">
                Limpiar filtros
              </button>
            </div>

            <div className="filter-group">
              <h4>Condición</h4>
              <label className="filter-option">
                <input
                  type="radio"
                  name="condition"
                  value=""
                  checked={filters.condition === ''}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                />
                Todos
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="condition"
                  value="new"
                  checked={filters.condition === 'new'}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                />
                Nuevo
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="condition"
                  value="used"
                  checked={filters.condition === 'used'}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                />
                Usado
              </label>
            </div>

            {categories.length > 1 && (
              <div className="filter-group">
                <h4>Categoría</h4>
                <select 
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="category-select"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="filter-group">
              <h4>Envío</h4>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.freeShipping}
                  onChange={(e) => handleFilterChange('freeShipping', e.target.checked)}
                />
                Envío gratis
              </label>
            </div>

            <div className="filter-group">
              <h4>Precio</h4>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Mín"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="price-input"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Máx"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="price-input"
                />
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="search-results">
            <div className="results-toolbar">
              <span className="results-info">
                {results.length} resultado{results.length !== 1 ? 's' : ''}
              </span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="relevance">Más relevantes</option>
                <option value="price_low">Menor precio</option>
                <option value="price_high">Mayor precio</option>
                <option value="newest">Más nuevo</option>
              </select>
            </div>

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Buscando productos...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h2>No hay publicaciones que coincidan con tu búsqueda.</h2>
                <div className="suggestions">
                  <p>Revisá la ortografía de la palabra.</p>
                  <p>Utilizá palabras más genéricas o menos palabras.</p>
                  <p>Navegá por las categorías para encontrar un producto similar.</p>
                </div>
                <Link to="/" className="back-home">Volver al inicio</Link>
              </div>
            ) : (
              <div className="products-grid">
                {results.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Search;
