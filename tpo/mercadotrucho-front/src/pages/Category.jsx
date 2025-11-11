import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { productsApi } from '../services/api';
import { useApp } from '../context/AppContext';
import './Category.css';

function Category() {
  const { category } = useParams();
  const { state, dispatch } = useApp();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('name-asc');

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const products = await productsApi.getProducts();
        const categoriesList = await productsApi.getCategories();
        
        dispatch({ type: 'SET_PRODUCTS', payload: products });
        setAllProducts(products);
        setCategories(categoriesList);
        
        // Filtrar productos por la categoría seleccionada
        const categoryProducts = products.filter(
          product => product.category.toLowerCase() === decodeURIComponent(category).toLowerCase()
        );
        setFilteredProducts(categoryProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchData();
  }, [dispatch, category]);

  // Ordenar productos cuando cambia el criterio de ordenamiento
  useEffect(() => {
    const categoryProducts = allProducts.filter(
      product => product.category.toLowerCase() === decodeURIComponent(category).toLowerCase()
    );

    const sorted = [...categoryProducts].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredProducts(sorted);
  }, [allProducts, category, sortBy]);

  const handleCategoryChange = (newCategory) => {
    // Redirigir a la nueva categoría
    window.location.href = `/category/${newCategory}`;
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const getCategoryDisplayName = (cat) => {
    const categoryNames = {
      'anteojos': 'Anteojos',
      'celulares': 'Celulares',
      'computacion': 'Computación',
      'electrodomesticos': 'Electrodomésticos',
      'deportes': 'Deportes',
      'audio': 'Audio'
    };
    return categoryNames[cat?.toLowerCase()] || cat;
  };

  if (state.loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span> &gt; </span>
          <span>{getCategoryDisplayName(category)}</span>
        </div>

        {/* Header de la categoría */}
        <div className="category-header">
          <h1>{getCategoryDisplayName(category)}</h1>
          <p>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'resultado' : 'resultados'}
          </p>
        </div>

        {/* Filtros */}
        <CategoryFilter
          categories={categories}
          selectedCategory={category}
          onCategoryChange={handleCategoryChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        {/* Resultados */}
        <div className="category-results">
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <h3>No se encontraron productos en esta categoría</h3>
              <p>Intenta buscar en otras categorías o revisa la ortografía.</p>
              <Link to="/" className="back-home">
                Volver al inicio
              </Link>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Category;