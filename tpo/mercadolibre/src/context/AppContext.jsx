import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const AppContext = createContext();

const initialState = {
  cart: [],
  products: [],
  loading: false,
  searchQuery: '',
  searchResults: []
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
    const userKey = getCartKey(currentUser);
    const guestKey = getCartKey(null);

    const loadGuestCart = () => {
      const guestRaw = localStorage.getItem(guestKey);
      if (!guestRaw) return [];
      try {
        const guestItems = JSON.parse(guestRaw).filter(item => item && item.id && item.quantity > 0);
        return guestItems;
      } catch (err) {
        console.error('Error parsing guest cart:', err);
        localStorage.removeItem(guestKey);
        return [];
      }
    };

    const loadUserCart = () => {
      const raw = localStorage.getItem(userKey);
      if (!raw) return [];
      try {
        const items = JSON.parse(raw).filter(item => item && item.id && item.quantity > 0);
        return items;
      } catch (err) {
        console.error('Error parsing user cart:', err);
        localStorage.removeItem(userKey);
        return [];
      }
    };

    if (!currentUser) {
      const guestItems = loadGuestCart();
      dispatch({ type: 'LOAD_CART', payload: guestItems });
      setIsInitialized(true);
      return;
    }

    // currentUser exists: load user cart and merge guest cart if any
    const guestItems = loadGuestCart();
    const userItems = loadUserCart();

    let merged = userItems;
    if (guestItems.length > 0) {
      // Merge guestItems into userItems by id (sum quantities)
      const mergedMap = new Map();
      userItems.forEach(item => mergedMap.set(item.id, { ...item }));
      guestItems.forEach(item => {
        if (mergedMap.has(item.id)) {
          mergedMap.get(item.id).quantity += item.quantity;
        } else {
          mergedMap.set(item.id, { ...item });
        }
      });
      merged = Array.from(mergedMap.values());
      // Persist merged under user key and clear guest cart
      try {
        localStorage.setItem(userKey, JSON.stringify(merged));
        localStorage.removeItem(guestKey);
      } catch (err) {
        console.error('Error saving merged cart:', err);
      }
    }

    // Si hay un pendingAddToCart en sessionStorage, agregarlo
    try {
      const pending = sessionStorage.getItem('pendingAddToCart');
      if (pending) {
        const { productId } = JSON.parse(pending);
        // Buscar el producto en la lista de productos cargados
        const product = state.products.find(p => String(p.id) === String(productId));
        if (product) {
          merged = [...merged];
          const existing = merged.find(item => String(item.id) === String(productId));
          if (existing) {
            if (existing.quantity < product.stock) {
              existing.quantity += 1;
            }
          } else {
            merged.push({ ...product, quantity: 1 });
          }
          // Persistir el carrito actualizado
          try {
            localStorage.setItem(userKey, JSON.stringify(merged));
          } catch (err) {}
        }
        sessionStorage.removeItem('pendingAddToCart');
      }
    } catch (err) {
      sessionStorage.removeItem('pendingAddToCart');
    }

    dispatch({ type: 'LOAD_CART', payload: merged });
    setIsInitialized(true);
  }, [currentUser, state.products]);

  // Guardar carrito en localStorage según usuario
  useEffect(() => {
    if (isInitialized) {
      const storageKey = getCartKey(currentUser);
      localStorage.setItem(storageKey, JSON.stringify(state.cart));
    }
  }, [state.cart, isInitialized, currentUser]);

  // Métodos de ayuda para el carrito
  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateCartQuantity = (productId, quantity) => {
    dispatch({ 
      type: 'UPDATE_CART_QUANTITY', 
      payload: { id: productId, quantity } 
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
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
