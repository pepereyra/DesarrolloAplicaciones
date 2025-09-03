import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault(); // Evita la recarga de la página por defecto

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/login', {
        username: username,
        password: password,
      });

      // Si la autenticación es exitosa, el servidor podría devolver un token o información del usuario
      console.log('Inicio de sesión exitoso:', response.data);
      setLoggedIn(true);
      // Aquí podrías guardar el token en el almacenamiento local, actualizar el estado global, etc.

    } catch (error) {
      console.error('Error al iniciar sesión:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || 'Error al iniciar sesión. Por favor, inténtalo de nuevo.');
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  if (loggedIn) {
    return <p>¡Has iniciado sesión correctamente!</p>;
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Iniciar Sesión</h2>
      <div>
        <label htmlFor="username">Usuario:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default LoginForm;