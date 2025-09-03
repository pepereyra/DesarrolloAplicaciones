import React from 'react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Confirmar Compra</h1>
      <div style={{ marginBottom: '1rem' }}>
        <h2>Resumen de la compra</h2>
        {/* Aquí irá el resumen del carrito */}
      </div>
      <Link 
        to="/cart"
        style={{
          backgroundColor: '#2D3277',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '1rem',
          textDecoration: 'none',
          display: 'inline-block'
        }}
      >
        Volver al carrito
      </Link>
      <button
        onClick={() => alert('¡Compra finalizada!')}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Confirmar compra
      </button>
    </div>
  );
};

export default Checkout;