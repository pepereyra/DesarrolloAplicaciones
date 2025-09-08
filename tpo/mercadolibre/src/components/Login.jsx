import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState({ type: '', message: '' });
    
    // Estados para los campos del formulario
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Obtener la función de login del contexto
    const { login } = useAuth();
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
        
        try {
            await login(formData.email, formData.password);
            setModalMessage({
                type: 'success',
                message: ' '
            });
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/');  // Redirige al home después del login
            }, 2000);
        } catch (error) {
            setModalMessage({
                type: 'error',
                message:  ' '
            });
            setShowModal(true);
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            
            {/* Modal de mensajes */}
            {showModal && (
                <>
                    <div className="modal-overlay" onClick={() => setShowModal(false)} />
                    <div className={`modal-message ${modalMessage.type}`}>
                        <h3>{modalMessage.type === 'success' ? '¡Inicio de sesión exitoso!' : 'Credenciales inválidas'}</h3>
                        <p>{modalMessage.message}</p>
                        <button onClick={() => setShowModal(false)}>Cerrar</button>
                    </div>
                </>
            )}
            
            <form onSubmit={handleSubmit} className="login-form">
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

                <button type="submit" className="login-button">
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}

export default Login;
