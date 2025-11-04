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
    
    // Efecto para cargar usuario completo desde la API si existe en localStorage
    useEffect(() => {
        const loadCompleteUser = async () => {
            const savedUser = loadUserFromStorage();
            const authToken = localStorage.getItem('authToken');
            
            if (savedUser && savedUser.id && authToken) {
                try {
                    // Cargar datos completos del usuario desde la API con autenticación
                    const response = await fetch(`http://localhost:8080/api/usuarios/${savedUser.id}`, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    });
                    
                    if (response.ok) {
                        const completeUser = await response.json();
                        setCurrentUser(completeUser);
                        localStorage.setItem('currentUser', JSON.stringify(completeUser));
                    } else {
                        // Si el token es inválido o el usuario no existe, limpiar la sesión
                        console.warn('Usuario no autenticado, limpiando sesión local');
                        setCurrentUser(null);
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('authToken');
                    }
                } catch (error) {
                    console.error('Error loading complete user data:', error);
                    // En caso de error de conexión, mantener el usuario local
                    console.log('Manteniendo sesión local debido a error de conexión');
                }
            }
        };
        
        loadCompleteUser();
    }, []);
    
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
            // Usar el endpoint de registro de Spring Boot
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userData.email,
                    password: userData.password,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    phone: userData.phone || ''
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al registrar usuario');
            }

            const authResponse = await response.json();
            
            // Guardar el token JWT en localStorage
            localStorage.setItem('authToken', authResponse.token);
            
            // Establecer el usuario actual
            setCurrentUser(authResponse.user);
            setError('');
            return authResponse.user;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    // Función para iniciar sesión
    const login = async (email, password) => {
        try {
            // Usar el endpoint de login de Spring Boot
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Credenciales inválidas');
            }

            const authResponse = await response.json();
            
            // Guardar el token JWT en localStorage
            localStorage.setItem('authToken', authResponse.token);
            
            // Establecer el usuario actual
            setCurrentUser(authResponse.user);
            setError('');
            return authResponse.user;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('authToken');
        setError('');
    };

    // Función para verificar si el usuario actual es propietario de un producto
    const isProductOwner = (productSellerId) => {
        return currentUser && currentUser.id === productSellerId;
    };

    // Función para verificar si el usuario puede comprar un producto
    const canPurchaseProduct = (productSellerId) => {
        return currentUser && currentUser.id !== productSellerId;
    };

    // Función para obtener información del vendedor
    const getSellerInfo = () => {
        console.log('getSellerInfo - currentUser:', currentUser);
        console.log('getSellerInfo - sellerProfile:', currentUser?.sellerProfile);
        return currentUser?.sellerProfile || null;
    };

    // Valor del contexto que será accesible para los componentes hijos
    const value = {
        currentUser,
        error,
        register,
        login,
        logout,
        isProductOwner,
        canPurchaseProduct,
        getSellerInfo
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, useAuth, AuthProvider };