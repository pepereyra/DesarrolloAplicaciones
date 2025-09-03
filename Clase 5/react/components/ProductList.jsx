import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import defaultImage from '../assets/imgXdefault.jpg';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/productos');
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Lista de Productos</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', padding: '1rem' }}>
        {products.map(product => (
          <Link 
            to={`/products/${product.id}`} 
            key={product.id}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ 
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              ':hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }
            }}>
              <img 
              // operador lógico ||
                src={product.imagen || defaultImage}
                alt={product.nombre}
                style={{ 
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '4px'
                }}
              />
              <h3 style={{ margin: '0.5rem 0' }}>{product.nombre}</h3>
              <p style={{ color: '#2D3277', fontSize: '1.25rem', fontWeight: 'bold', margin: '0' }}>
                ${product.precio.toLocaleString('es-AR')}
              </p>
              <p style={{ color: '#666', margin: '0' }}>{product.descripcion}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;