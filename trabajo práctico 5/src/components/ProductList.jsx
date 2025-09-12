import { useState, useEffect } from 'react';
import { getProducts, getProductsByCategory } from '../services/productService';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
  // Estado para almacenar los productos
  const [products, setProducts] = useState([]);
  // Estado para manejar el loading
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);
  // Estado para el filtro de categoría
  const [selectedCategory, setSelectedCategory] = useState('');

  // Categorías disponibles
  const categories = ['Electronics', 'Clothing', 'Books', 'Food'];

  // useEffect para cargar productos cuando el componente se monta o cambia la categoría
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let productsData;
        if (selectedCategory) {
          // Si hay una categoría seleccionada, filtrar por esa categoría
          productsData = await getProductsByCategory(selectedCategory);
        } else {
          // Si no hay categoría seleccionada, obtener todos los productos
          productsData = await getProducts();
        }
        
        setProducts(productsData);
      } catch (err) {
        setError('Error al cargar los productos. Verifica que json-server esté ejecutándose.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    // Ejecutar la función para obtener productos
    fetchProducts();
  }, [selectedCategory]); // El efecto se ejecuta cuando selectedCategory cambia

  // Función para manejar el cambio de categoría
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Función para limpiar el filtro
  const clearFilter = () => {
    setSelectedCategory('');
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="product-list-container">
        <div className="loading">
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="product-list-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <h2>Nuestros Productos</h2>
      
      {/* Filtros de categoría */}
      <div className="category-filters">
        <button 
          className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
          onClick={clearFilter}
        >
          Todos
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Mostrar información del filtro */}
      {selectedCategory && (
        <p className="filter-info">
          Mostrando productos de: <strong>{selectedCategory}</strong>
        </p>
      )}

      {/* Lista de productos */}
      {products.length === 0 ? (
        <div className="no-products">
          <p>No se encontraron productos.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
