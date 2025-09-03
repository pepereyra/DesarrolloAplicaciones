import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';

const LoginJWTContext = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credentials);
    if (success) {
      navigate('/checkout');
    }
  };

  return (
    <div style={{ 
      padding: '2rem',
      maxWidth: '400px',
      margin: '0 auto',
      marginTop: '2rem'
    }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Iniciar Sesión</h1>
      {error && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label 
            htmlFor="email" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}
          >
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>
        
        <div>
          <label 
            htmlFor="password"
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#2D3277',
            color: 'white',
            padding: '0.75rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            marginTop: '1rem',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
};

export default LoginJWTContext;