import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState({ type: '', message: '' });
    
    // Estados para los campos del formulario
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'user',
        avatar: 'https://via.placeholder.com/150',
        createdAt: new Date().toISOString()
    });

    // Obtener la función de registro del contexto
    const { register } = useAuth();
    const [error, setError] = useState('');

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones básicas
        if (!formData.email.includes('@')) {
            setError('Por favor ingrese un email válido');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            const userData = {
                ...formData,
                role: 'user',
                avatar: 'https://via.placeholder.com/150',
                createdAt: new Date().toISOString()
            };
            await register(userData);
            setModalMessage({
                type: 'success',
                message: ''
            });
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/login');
            }, 2000);
        } catch (error) {
            setModalMessage({
                type: 'error',
                message: error.message
            });
            setShowModal(true);
        }
    };

    return (
        <div className="register-container">
            <h2>Registro de Usuario</h2>
            
            {/* Modal de mensajes */}
            {showModal && (
                <>
                    <div className="modal-overlay" onClick={() => setShowModal(false)} />
                    <div className={`modal-message ${modalMessage.type}`}>
                        <h3>{modalMessage.type === 'success' ? '¡Usuario registrado exitosamente!' : ' '}</h3>
                        <p>{modalMessage.message}</p>
                        <button onClick={() => setShowModal(false)}>Cerrar</button>
                    </div>
                </>
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

                <button type="submit" className="register-button">
                    Registrarse
                </button>
            </form>
        </div>
    );
}

export default Register;
