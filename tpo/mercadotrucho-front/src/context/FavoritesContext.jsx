import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

// Reducer para manejar el estado de favoritos
const favoritesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FAVORITES':
      return {
        ...state,
        items: action.payload
      };
    case 'ADD_FAVORITE':
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'CLEAR_FAVORITES':
      return {
        ...state,
        items: []
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  loading: false
};

export function FavoritesProvider({ children }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);
  const { currentUser } = useAuth();

  // Cargar favoritos del localStorage cuando el usuario cambia
  useEffect(() => {
    if (currentUser) {
      const savedFavorites = localStorage.getItem(`favorites_${currentUser.id}`);
      if (savedFavorites) {
        dispatch({ type: 'SET_FAVORITES', payload: JSON.parse(savedFavorites) });
      }
    } else {
      dispatch({ type: 'CLEAR_FAVORITES' });
    }
  }, [currentUser]);

  // Guardar favoritos en localStorage cuando cambian
  useEffect(() => {
    if (currentUser && state.items.length >= 0) {
      localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(state.items));
    }
  }, [state.items, currentUser]);

  const addToFavorites = (product) => {
    if (!currentUser) {
      alert('Debes iniciar sesión para agregar favoritos');
      return false;
    }

    const isAlreadyFavorite = state.items.some(item => item.id === product.id);
    if (isAlreadyFavorite) {
      return false;
    }

    dispatch({ type: 'ADD_FAVORITE', payload: product });
    return true;
  };

  const removeFromFavorites = (productId) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: productId });
  };

  const isFavorite = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const toggleFavorite = (product) => {
    if (!currentUser) {
      alert('Debes iniciar sesión para agregar favoritos');
      return false;
    }

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
      return false;
    } else {
      addToFavorites(product);
      return true;
    }
  };

  const getFavoritesCount = () => {
    return state.items.length;
  };

  const clearFavorites = () => {
    dispatch({ type: 'CLEAR_FAVORITES' });
  };

  const value = {
    favorites: state.items,
    loading: state.loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    getFavoritesCount,
    clearFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}