import { useState, useEffect, useRef } from 'react';
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
        setCategories([]); // Mostrar dropdown vacío si falla
      }
    };

    fetchCategories();
  }, []);

  const closeTimeout = useRef(null);

  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // small delay to allow pointer to reach dropdown without closing
    closeTimeout.current = setTimeout(() => setIsOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

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
          <ul className="category-list">
            {categories.map((categoria) => (
              <li key={categoria.id || categoria.name} className="category-list-item">
                <Link
                  to={`/?category=${encodeURIComponent(categoria.name)}`}
                  className="category-text-item"
                  onClick={() => setIsOpen(false)}
                >
                  {categoria.name}
                </Link>
              </li>
            ))}
          </ul>

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

export default CategoryDropdown;
