import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useApp } from '../context/AppContext';
import './Profile.css';

function Profile() {
  const { currentUser } = useAuth();
  const { getFavoritesCount } = useFavorites();
  const { state } = useApp();
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    if (currentUser) {
      setEditForm({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        avatar: currentUser.avatar || ''
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="login-required">
            <h2>Inicia sesión para ver tu perfil</h2>
            <p>Accede a tu cuenta para gestionar tu información personal</p>
            <div className="auth-actions">
              <Link to="/login" className="login-btn">
                Iniciar sesión
              </Link>
              <Link to="/register" className="register-btn">
                Crear cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cartItemsCount = state.cart.length > 0 
    ? state.cart.reduce((total, item) => total + item.quantity, 0) 
    : 0;

  const favoritesCount = getFavoritesCount();

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Aquí se podría implementar la actualización del perfil
    console.log('Actualizar perfil:', editForm);
    setIsEditingPersonal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReputationInfo = (reputation) => {
    const reputations = {
      bronze: { label: 'Bronce', color: '#cd7f32', icon: '🥉' },
      silver: { label: 'Plata', color: '#c0c0c0', icon: '🥈' },
      gold: { label: 'Oro', color: '#ffd700', icon: '🥇' },
      platinum: { label: 'Platino', color: '#e5e4e2', icon: '💎' }
    };
    return reputations[reputation] || reputations.bronze;
  };

  const reputation = getReputationInfo(currentUser.sellerProfile?.reputation);

  return (
    <div className="profile-page">
      <div className="container">
        {/* Header del perfil */}
        <div className="profile-header">
          <div className="profile-avatar">
            <img 
              src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.firstName + '+' + currentUser.lastName)}&background=3483fa&color=fff&size=120`} 
              alt={`${currentUser.firstName} ${currentUser.lastName}`}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.firstName + '+' + currentUser.lastName)}&background=3483fa&color=fff&size=120`;
              }}
            />
          </div>
          
          <div className="profile-info">
            <h1>{currentUser.firstName} {currentUser.lastName}</h1>
            <p className="profile-email">{currentUser.email}</p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{favoritesCount}</span>
                <span className="stat-label">Favoritos</span>
              </div>
              <div className="stat">
                <span className="stat-number">{cartItemsCount}</span>
                <span className="stat-label">En carrito</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {formatDate(currentUser.createdAt).split(' ')[2]}
                </span>
                <span className="stat-label">Desde</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          {/* Información Personal */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Información Personal</h2>
              <button 
                className="edit-btn"
                onClick={() => setIsEditingPersonal(!isEditingPersonal)}
              >
                {isEditingPersonal ? 'Cancelar' : 'Editar'}
              </button>
            </div>
            
            {isEditingPersonal ? (
              <form onSubmit={handleEditSubmit} className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellido</label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>URL del Avatar</label>
                  <input
                    type="url"
                    value={editForm.avatar}
                    onChange={(e) => setEditForm({...editForm, avatar: e.target.value})}
                    placeholder="https://ejemplo.com/mi-foto.jpg"
                  />
                  <small>Deja vacío para usar un avatar generado automáticamente</small>
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">Guardar cambios</button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditingPersonal(false)}
                    className="cancel-btn"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-item">
                  <label>Nombre completo</label>
                  <span>{currentUser.firstName} {currentUser.lastName}</span>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <span>{currentUser.email}</span>
                </div>
                <div className="detail-item">
                  <label>Fecha de registro</label>
                  <span>{formatDate(currentUser.createdAt)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Perfil de Vendedor (si aplica) */}
          {currentUser.sellerProfile && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Perfil de Vendedor</h2>
                <Link to={`/vendedor/${currentUser.id}`} className="view-public-btn">
                  Ver perfil público
                </Link>
              </div>
              
              <div className="seller-details">
                <div className="detail-item">
                  <label>Nombre de tienda</label>
                  <span>{currentUser.sellerProfile.nickname}</span>
                </div>
                <div className="detail-item">
                  <label>Reputación</label>
                  <span className="reputation" style={{color: reputation.color}}>
                    {reputation.icon} {reputation.label}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Ubicación</label>
                  <span>{currentUser.sellerProfile.location}</span>
                </div>
                {currentUser.sellerProfile.phone && (
                  <div className="detail-item">
                    <label>Teléfono</label>
                    <span>{currentUser.sellerProfile.phone}</span>
                  </div>
                )}
                {currentUser.sellerProfile.description && (
                  <div className="detail-item">
                    <label>Descripción</label>
                    <span>{currentUser.sellerProfile.description}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Acciones rápidas */}
          <div className="profile-section">
            <h2>Acciones rápidas</h2>
            <div className="quick-actions">
              <Link to="/favorites" className="quick-action">
                <div className="action-icon">❤️</div>
                <div className="action-content">
                  <h3>Mis Favoritos</h3>
                  <p>{favoritesCount} productos guardados</p>
                </div>
              </Link>
              
              <Link to="/carrito" className="quick-action">
                <div className="action-icon">🛒</div>
                <div className="action-content">
                  <h3>Mi Carrito</h3>
                  <p>{cartItemsCount} productos en carrito</p>
                </div>
              </Link>
              
              {currentUser.sellerProfile && (
                <Link to="/vender" className="quick-action">
                  <div className="action-icon">💼</div>
                  <div className="action-content">
                    <h3>Panel de Vendedor</h3>
                    <p>Gestionar productos</p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;