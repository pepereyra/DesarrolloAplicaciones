import { useApp } from '../context/AppContext';

export const useCart = () => {
  const { state, dispatch } = useApp();

  const addToCart = (product, quantity = 1) => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_TO_CART', payload: product });
    }
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ 
        type: 'UPDATE_CART_QUANTITY', 
        payload: { id: productId, quantity: newQuantity } 
      });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (productId) => {
    const item = state.cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const canAddToCart = (product) => {
    const currentQuantity = getItemQuantity(product.id);
    return product.stock > 0 && currentQuantity < product.stock;
  };

  const getAvailableStock = (product) => {
    const currentQuantity = getItemQuantity(product.id);
    return Math.max(0, product.stock - currentQuantity);
  };

  const getSubtotal = () => {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getShippingCost = () => {
    const paidShippingItems = state.cart.filter(item => !item.free_shipping);
    return paidShippingItems.length > 0 ? 2500 : 0;
  };

  const getTotal = () => {
    return getSubtotal() + getShippingCost();
  };

  const getTotalItems = () => {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return {
    cart: state.cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    canAddToCart,
    getAvailableStock,
    getSubtotal,
    getShippingCost,
    getTotal,
    getTotalItems,
    formatPrice
  };
};
