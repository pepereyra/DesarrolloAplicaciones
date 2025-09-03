import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica real de autenticación
    localStorage.setItem('isAuthenticated', 'true');
    // Redirigir al checkout después del login
    navigate('/checkout');
  };

  return (
    <div style={{ 
      padding: '2rem',
      maxWidth: '400px',
      margin: '0 auto',
      marginTop: '2rem'
    }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Iniciar Sesión</h1>
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
          style={{
            backgroundColor: '#2D3277',
            color: 'white',
            padding: '0.75rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginTop: '1rem'
          }}
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default Login;