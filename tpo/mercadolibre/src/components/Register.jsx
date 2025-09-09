import { useState } from 'react';
import useForm from '../hooks/useForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState({ type: '', message: '' });
    const { register } = useAuth();

    const {
        formData,
        setFormData,
        error,
        setError,
        loading,
        handleChange,
        handleSubmit
    } = useForm(
        {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            role: 'user',
            avatar: 'https://via.placeholder.com/150',
            createdAt: new Date().toISOString()
        },
        async (data) => {
            // Validaciones básicas
            if (!data.email.includes('@')) {
                setError('Por favor ingrese un email válido');
                throw new Error('Por favor ingrese un email válido');
            }
            if (data.password.length < 6) {
                setError('La contraseña debe tener al menos 6 caracteres');
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }

            try {
                const userData = {
                    ...data,
                    role: 'user',
                    avatar: 'https://via.placeholder.com/150',
                    createdAt: new Date().toISOString()
                };
                await register(userData);
                setModalMessage({ type: 'success', message: '¡Usuario registrado exitosamente!' });
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate('/');
                }, 2000);
            } catch (err) {
                setModalMessage({ type: 'error', message: err.message || 'Error al registrar usuario' });
                setShowModal(true);
                throw err;
            }
        }
    );

    return (
        <div className="register-container">
            <h2>Registro de Usuario</h2>

            {/* Modal de mensajes */}
            {showModal && (
                <div>
                    <div className="modal-overlay" onClick={() => setShowModal(false)} />
                    <div className={`modal-message ${modalMessage.type}`}>
                        <h3>{modalMessage.type === 'success' ? '¡Usuario registrado exitosamente!' : 'Error'}</h3>
                        <p>{modalMessage.message}</p>
                        <button onClick={() => setShowModal(false)}>Cerrar</button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="firstName">Nombre:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Apellido:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="register-button" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}

export default Register;
