import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import defaultImage from '../assets/imgXdefault.jpg';

// Configuración del interceptor
axios.interceptors.request.use(
  (config) => {
    // para que funcione previamente debemos guardar el token en el localStorage al iniciar sesión
    // Por ejemplo:  localStorage.setItem('authToken', token);    
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// agregar encabezados comunes
axios.interceptors.request.use(
    (config) => {
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept-Language'] = localStorage.getItem('language') || 'es';
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

// manejo errores
import axios from 'axios';
// import { logoutUser } from './auth'; // Supongamos que tienes una función para cerrar sesión
// import { mostrarMensajeError } from './ui'; // Supongamos que tienes una función para mostrar errores

axios.interceptors.response.use(
  (response) => {
    // Devolver la respuesta sin modificaciones si es exitosa
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // logoutUser();
      // mostrarMensajeError('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
      console.error('Error de autenticación:', error.response.data);
      // Puedes también intentar refrescar el token aquí si implementaste esa lógica
    }
    return Promise.reject(error);
  }
);  

const ProductListAxios = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/productos');

        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error al cargar los productos');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Lista de Productos (Axios)</h1>
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

export default ProductListAxios;