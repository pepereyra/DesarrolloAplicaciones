import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/productos/${id}`);
        if (!response.ok) {
          throw new Error('Producto no encontrado');
        }
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Obtener el carrito actual del localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Verificar si el producto ya está en el carrito
    const existingProductIndex = currentCart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex >= 0) {
      // Si el producto existe, incrementar la cantidad
      currentCart[existingProductIndex].quantity += 1;
    } else {
      // Si el producto no existe, agregarlo con cantidad 1
      currentCart.push({
        ...product,
        quantity: 1
      });
    }
    
    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    navigate('/cart');
  };

  if (loading) return <div>Cargando producto...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No se encontró el producto</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{product.nombre}</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div>
          <img 
            src={product.imagen} 
            alt={product.nombre}
            style={{
              width: '100%',
              maxHeight: '500px',
              objectFit: 'cover',
              borderRadius: '8px'
            }}
          />
        </div>
        <div>
          <h2 style={{ color: '#2D3277', fontSize: '2rem', marginBottom: '1rem' }}>
            ${product.precio.toLocaleString('es-AR')}
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#666' }}>
            {product.descripcion}
          </p>
          <button
            onClick={handleAddToCart}
            style={{
              backgroundColor: '#2D3277',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Agregar al Carrito
          </button>
          <div style={{ marginTop: '2rem' }}>
            <h3>Detalles del producto</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {product.detalles && Object.entries(product.detalles).map(([key, value]) => (
                <li key={key} style={{ margin: '0.5rem 0', color: '#666' }}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;