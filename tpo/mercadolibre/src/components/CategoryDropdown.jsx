import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/api';
import './CategoryDropdown.css';

function CategoryDropdown() {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div 
      className="category-dropdown"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to="/categories" className="category-trigger">
        Categorías
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
      
      {isOpen && (
        <div className="category-dropdown-menu">
          <div className="category-grid">
            {categories.slice(0, 12).map((category) => (
              <Link
                key={category}
                to={`/category/${encodeURIComponent(category.toLowerCase())}`}
                className="category-item"
                onClick={() => setIsOpen(false)}
              >
                <span className="category-icon">
                  {getCategoryIcon(category)}
                </span>
                <span className="category-name">{category}</span>
              </Link>
            ))}
          </div>
          
          {categories.length > 12 && (
            <div className="category-footer">
              <Link to="/categories" className="see-all-categories">
                Ver todas las categorías
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Función para obtener iconos según categoría
function getCategoryIcon(category) {
  const icons = {
    'celulares y telefonos': '📱',
    'celulares': '📱',
    'computacion': '💻',
    'electrodomesticos': '🏠',
    'deportes y fitness': '⚽',
    'deportes': '⚽',
    'audio': '🎵',
    'anteojos': '🕶️',
    'hogar muebles y jardin': '🪑',
    'belleza y cuidado personal': '💄',
    'ropa y accesorios': '👕',
    'juegos y juguetes': '🎮',
    'bebes': '👶',
    'salud y equipamiento medico': '🏥',
    'industrias y oficinas': '🏢',
    'construccion': '🔨',
    'accesorios para vehiculos': '🚗',
    'herramientas': '🔧',
    'agro': '🌾',
    'alimentos y bebidas': '🍎',
    'arte y manualidades': '🎨',
    'antiguedades': '🏺',
    'musica peliculas y series': '🎬',
    'libros revistas y comics': '📚'
  };
  
  return icons[category.toLowerCase()] || '📦';
}

export default CategoryDropdown;
