import { createContext, useContext, useReducer, useEffect, useState } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  cart: [],
  products: [],
  loading: false,
  searchQuery: '',
  searchResults: []
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_TO_CART':
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

  // Cargar carrito desde localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('mercadolibre-cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        // Validar y filtrar items válidos, pero sin verificar stock aquí
        // ya que los productos pueden haber cambiado desde que se guardó
        const validItems = cartItems.filter(item => 
          item && item.id && item.quantity > 0
        );
        dispatch({ type: 'LOAD_CART', payload: validItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('mercadolibre-cart');
      }
    }
    setIsInitialized(true);
  }, []);

  // Guardar carrito en localStorage (solo después de inicializar)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('mercadolibre-cart', JSON.stringify(state.cart));
    }
  }, [state.cart, isInitialized]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
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
