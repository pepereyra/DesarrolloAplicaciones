import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { cartApi } from '../services/api';

const AppContext = createContext();

const initialState = {
  cart: [],
  products: [],
  loading: false,
  searchQuery: '',
  searchResults: [],
  cartLoading: false,  // Loading específico para operaciones de carrito
  cartError: null      // Error específico para operaciones de carrito
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        // Verificar stock antes de incrementar
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity <= action.payload.stock) {
          return {
            ...state,
            cart: state.cart.map(item =>
              item.id === action.payload.id
                ? { ...item, quantity: newQuantity }
                : item
            )
          };
        }
        return state; // No incrementar si se alcanzó el stock máximo
      }
      // Verificar stock antes de agregar nuevo item
      if (action.payload.stock > 0) {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }]
        };
      }
      return state; // No agregar si no hay stock
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { 
                ...item, 
                quantity: Math.min(
                  Math.max(1, action.payload.quantity), 
                  item.stock || 999
                ) 
              }
            : item
        ).filter(item => item.quantity > 0)
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'LOAD_CART':
      return { ...state, cart: action.payload };
    case 'SET_CART_LOADING':
      return { ...state, cartLoading: action.payload };
    case 'SET_CART_ERROR':
      return { ...state, cartError: action.payload };
    case 'SET_CART_FROM_BACKEND':
      return { 
        ...state, 
        cart: action.payload, 
        cartError: null, 
        cartLoading: false 
      };
    default:
      return state;
  }
}


export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);
  const { currentUser } = useAuth();

  // Build storage key based on user (guest vs user id/email)
  const getCartKey = (user) => {
    if (!user) return 'mercadolibre-cart-guest';
    const id = user.id || user.email || 'unknown';
    return `mercadolibre-cart-${id}`;
  };

  useEffect(() => {
    const initializeCart = async () => {
      if (!currentUser) {
        // Usuario no autenticado: cargar desde localStorage
        const guestKey = getCartKey(null);
        const guestRaw = localStorage.getItem(guestKey);
        let guestItems = [];
        
        if (guestRaw) {
          try {
            guestItems = JSON.parse(guestRaw).filter(item => item && item.id && item.quantity > 0);
          } catch (err) {
            console.error('Error parsing guest cart:', err);
            localStorage.removeItem(guestKey);
          }
        }
        
        dispatch({ type: 'LOAD_CART', payload: guestItems });
        setIsInitialized(true);
        return;
      }

      // Usuario autenticado: cargar desde backend
      try {
        await loadCartFromBackend(currentUser.id);
        
        // Migrar carrito de invitado si existe
        const guestKey = getCartKey(null);
        const guestRaw = localStorage.getItem(guestKey);
        
        if (guestRaw) {
          try {
            const guestItems = JSON.parse(guestRaw).filter(item => item && item.id && item.quantity > 0);
            
            // Agregar items del carrito de invitado al backend
            for (const item of guestItems) {
              try {
                await cartApi.addToCart(currentUser.id, item.id, item.quantity);
              } catch (error) {
                console.error('Error migrando item del carrito:', error);
              }
            }
            
            // Recargar carrito después de la migración
            if (guestItems.length > 0) {
              await loadCartFromBackend(currentUser.id);
            }
            
            // Limpiar carrito de invitado
            localStorage.removeItem(guestKey);
          } catch (err) {
            console.error('Error migrando carrito de invitado:', err);
            localStorage.removeItem(guestKey);
          }
        }

        // Manejar pendingAddToCart si existe
        try {
          const pending = sessionStorage.getItem('pendingAddToCart');
          if (pending) {
            const { productId } = JSON.parse(pending);
            await cartApi.addToCart(currentUser.id, productId, 1);
            await loadCartFromBackend(currentUser.id);
            sessionStorage.removeItem('pendingAddToCart');
          }
        } catch (err) {
          console.error('Error procesando pendingAddToCart:', err);
          sessionStorage.removeItem('pendingAddToCart');
        }

      } catch (error) {
        console.error('Error inicializando carrito:', error);
        // Fallback a carrito vacío en caso de error del backend
        dispatch({ type: 'SET_CART_FROM_BACKEND', payload: [] });
      }
      
      setIsInitialized(true);
    };

    initializeCart();
  }, [currentUser]);

  // Guardar carrito en localStorage según usuario (solo para usuarios no autenticados)
  useEffect(() => {
    if (isInitialized && !currentUser) {
      const storageKey = getCartKey(currentUser);
      localStorage.setItem(storageKey, JSON.stringify(state.cart));
    }
  }, [state.cart, isInitialized, currentUser]);

  // Función auxiliar para convertir datos del backend al formato del frontend
  const convertBackendCartToFrontend = (carritoDTO) => {
    if (!carritoDTO || !carritoDTO.items) {
      return [];
    }
    
    return carritoDTO.items.map(item => ({
      id: item.productoId,
      title: item.title,
      thumbnail: item.imageUrl,
      price: item.unitPrice / 100, // Convertir centavos a pesos
      quantity: item.quantity,
      stock: item.stock || 999, // Usar stock del backend o valor por defecto
      itemId: item.id, // ID del item en el carrito (necesario para eliminar/actualizar)
      // Agregar campos requeridos por Cart.jsx
      free_shipping: item.freeShipping || false,
      seller: {
        nickname: item.sellerNickname || 'Vendedor',
        reputation: item.sellerReputation || 'standard'
      }
    }));
  };

  // Función auxiliar para cargar carrito desde backend
  const loadCartFromBackend = async (usuarioId) => {
    try {
      dispatch({ type: 'SET_CART_LOADING', payload: true });
      const carritoDTO = await cartApi.getCart(usuarioId);
      const frontendCart = convertBackendCartToFrontend(carritoDTO);
      dispatch({ type: 'SET_CART_FROM_BACKEND', payload: frontendCart });
    } catch (error) {
      console.error('Error cargando carrito desde backend:', error);
      dispatch({ type: 'SET_CART_ERROR', payload: error.message });
      // En caso de error, mantener carrito vacío
      dispatch({ type: 'SET_CART_FROM_BACKEND', payload: [] });
    }
  };

  // Métodos de ayuda para el carrito - ahora con integración backend
  const addToCart = async (product, quantity = 1) => {
    if (currentUser) {
      // Usuario autenticado: usar backend
      try {
        dispatch({ type: 'SET_CART_LOADING', payload: true });
        const carritoDTO = await cartApi.addToCart(
          currentUser.id, 
          product.id, 
          quantity
        );
        const frontendCart = convertBackendCartToFrontend(carritoDTO);
        dispatch({ type: 'SET_CART_FROM_BACKEND', payload: frontendCart });
      } catch (error) {
        console.error('Error agregando al carrito:', error);
        dispatch({ type: 'SET_CART_ERROR', payload: error.message });
        // Fallback a localStorage en caso de error
        for (let i = 0; i < quantity; i++) {
          dispatch({ type: 'ADD_TO_CART', payload: product });
        }
        dispatch({ type: 'SET_CART_LOADING', payload: false });
      }
    } else {
      // Usuario no autenticado: usar localStorage
      for (let i = 0; i < quantity; i++) {
        dispatch({ type: 'ADD_TO_CART', payload: product });
      }
    }
  };

  const removeFromCart = async (productId) => {
    if (currentUser) {
      // Usuario autenticado: usar backend
      try {
        dispatch({ type: 'SET_CART_LOADING', payload: true });
        
        // Buscar el itemId en el carrito actual
        const item = state.cart.find(item => item.id === productId);
        
        if (item && item.itemId) {
          const carritoDTO = await cartApi.removeFromCart(
            currentUser.id, 
            item.itemId
          );
          
          const frontendCart = convertBackendCartToFrontend(carritoDTO);
          dispatch({ type: 'SET_CART_FROM_BACKEND', payload: frontendCart });
        } else {
          // Fallback: eliminar directamente del estado local
          dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
          dispatch({ type: 'SET_CART_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error eliminando del carrito:', error);
        dispatch({ type: 'SET_CART_ERROR', payload: error.message });
        
        // Fallback a localStorage en caso de error
        dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
        dispatch({ type: 'SET_CART_LOADING', payload: false });
      }
    } else {
      // Usuario no autenticado: usar localStorage
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (currentUser) {
      // Usuario autenticado: usar backend
      try {
        dispatch({ type: 'SET_CART_LOADING', payload: true });
        // Buscar el itemId en el carrito actual
        const item = state.cart.find(item => item.id === productId);
        if (item && item.itemId) {
          const carritoDTO = await cartApi.updateCartItem(
            currentUser.id, 
            item.itemId, 
            quantity
          );
          const frontendCart = convertBackendCartToFrontend(carritoDTO);
          dispatch({ type: 'SET_CART_FROM_BACKEND', payload: frontendCart });
        }
      } catch (error) {
        console.error('Error actualizando cantidad:', error);
        dispatch({ type: 'SET_CART_ERROR', payload: error.message });
        // Fallback a localStorage en caso de error
        dispatch({ 
          type: 'UPDATE_CART_QUANTITY', 
          payload: { id: productId, quantity } 
        });
        dispatch({ type: 'SET_CART_LOADING', payload: false });
      }
    } else {
      // Usuario no autenticado: usar localStorage
      dispatch({ 
        type: 'UPDATE_CART_QUANTITY', 
        payload: { id: productId, quantity } 
      });
    }
  };

  const clearCart = async () => {
    if (currentUser) {
      // Usuario autenticado: usar backend
      try {
        dispatch({ type: 'SET_CART_LOADING', payload: true });
        await cartApi.clearCart(currentUser.id);
        dispatch({ type: 'SET_CART_FROM_BACKEND', payload: [] });
      } catch (error) {
        console.error('Error vaciando carrito:', error);
        dispatch({ type: 'SET_CART_ERROR', payload: error.message });
        // Fallback a localStorage en caso de error
        dispatch({ type: 'CLEAR_CART' });
        dispatch({ type: 'SET_CART_LOADING', payload: false });
      }
    } else {
      // Usuario no autenticado: usar localStorage
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  // Métodos de búsqueda
  const setSearchQuery = (query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const setSearchResults = (results) => {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
  };

  const value = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    setSearchQuery,
    setSearchResults
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
