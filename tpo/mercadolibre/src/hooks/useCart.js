import { useApp } from '../context/AppContext';

export const useCart = () => {
  const { 
    state, 
    addToCart: contextAddToCart,
    removeFromCart: contextRemoveFromCart, 
    updateCartQuantity: contextUpdateQuantity,
    clearCart: contextClearCart
  } = useApp();

  const addToCart = async (product, quantity = 1) => {
    try {
      await contextAddToCart(product, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await contextRemoveFromCart(productId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await removeFromCart(productId);
      } else {
        await contextUpdateQuantity(productId, newQuantity);
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await contextClearCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
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
    cartLoading: state.cartLoading,
    cartError: state.cartError,
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
