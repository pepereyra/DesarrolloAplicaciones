import { createContext, useState, useContext, useEffect } from 'react';

// Creamos el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

// Efecto para cargar el usuario desde localStorage al iniciar
const loadUserFromStorage = () => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
};

const AuthProvider = ({ children }) => {
    // Estado para almacenar la información del usuario actual
    const [currentUser, setCurrentUser] = useState(loadUserFromStorage);
    // Estado para manejar errores
    const [error, setError] = useState('');
    
    // Efecto para guardar el usuario en localStorage cuando cambie
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    // Función para registrar un nuevo usuario
    const register = async (userData) => {
        try {
            // Verificar si el usuario ya existe
            const response = await fetch('http://localhost:3000/users');
            const users = await response.json();
            
            if (users.some(user => user.email === userData.email)) {
                throw new Error('El email ya está registrado');
            }

            // Preparar los datos del nuevo usuario
            const newUserData = {
                ...userData,
                id: users.length + 1,
                role: 'user',
                avatar: 'https://via.placeholder.com/150',
                createdAt: new Date().toISOString()
            };

            // Guardar nuevo usuario
            const saveUser = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUserData)
            });

            if (!saveUser.ok) {
                throw new Error('Error al registrar usuario');
            }

            const newUser = await saveUser.json();
            setCurrentUser(newUser);
            setError('');
            return newUser;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    // Función para iniciar sesión
    const login = async (email, password) => {
        try {
            // Buscar usuario por email
            const response = await fetch(`http://localhost:3000/users?email=${email}`);
            const users = await response.json();

            const user = users.find(u => u.password === password);

            if (!user) {
                throw new Error('Credenciales inválidas');
            }

            setCurrentUser(user);
            setError('');
            return user;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        setCurrentUser(null);
        setError('');
    };

    // Valor del contexto que será accesible para los componentes hijos
    const value = {
        currentUser,
        error,
        register,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, useAuth, AuthProvider };