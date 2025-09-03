import { useState, useEffect } from 'react';
import FollowCard from './FollowCard';
// import CardSinMaterialUI from '../CardSinMaterialUI';

const UserCards = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://localhost:3000/usuarios');
        if (!response.ok) {
          throw new Error('Error al cargar los usuarios');
        }
        const data = await response.json();
        setUsuarios(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '20px', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      {usuarios.map((usuario) => (
        <FollowCard
          key={usuario.id}
          name={`${usuario.nombre} ${usuario.apellido}`}
          username={usuario.username}
          avatarUrl={usuario.avatar}
        />
      ))}
    </div>
  );
};

export default UserCards;