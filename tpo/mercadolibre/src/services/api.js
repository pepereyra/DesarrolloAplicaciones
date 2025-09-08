import { localProductsService } from './localProductsService.js';

const API_URL = 'http://localhost:3002';

// Servicio principal - usa json-server como fuente principal
export const productsApi = {
  getProducts: async () => {
    try {
      // Usar json-server como fuente principal
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }
      return await response.json();
    } catch (error) {
      console.warn('Fallback to local products:', error);
      // Fallback a productos locales si falla json-server
      try {
        return await localProductsService.getProducts();
      } catch (localError) {
        console.error('Error fetching products from both sources:', localError);
        throw localError;
      }
    }
  },

  getProduct: async (id) => {
    try {
      // Usar json-server como fuente principal
      const response = await fetch(`${API_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error('Producto no encontrado');
      }
      return await response.json();
    } catch (error) {
      console.warn('Fallback to local product:', error);
      // Fallback a productos locales si falla json-server
      try {
        return await localProductsService.getProduct(id);
      } catch (localError) {
        console.error('Error fetching product from both sources:', localError);
        throw localError;
      }
    }
  },

  getProductsByCategory: async (category) => {
    try {
      const response = await fetch(`${API_URL}/products?category=${category}`);
      if (!response.ok) {
        throw new Error('Error al filtrar productos');
      }
      return await response.json();
    } catch (error) {
      console.warn('Fallback to local products for category:', error);
      try {
        return await localProductsService.getProductsByCategory(category);
      } catch (localError) {
        console.error('Error fetching products by category:', localError);
        throw localError;
      }
    }
  },

  getCategories: async () => {
    try {
      const products = await productsApi.getProducts();
      const categories = [...new Set(products.map(p => p.category))];
      return categories.sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  searchProducts: async (query) => {
    try {
      const response = await fetch(`${API_URL}/products?q=${query}`);
      if (!response.ok) {
        throw new Error('Error en búsqueda');
      }
      return await response.json();
    } catch (error) {
      console.warn('Fallback to local search:', error);
      try {
        return await localProductsService.searchProducts(query);
      } catch (localError) {
        console.error('Error searching products:', localError);
        throw localError;
      }
    }
  }
};

// API original mantenida para compatibilidad
export const api = {
  // Productos (delegando a productsApi)
  getProducts: () => productsApi.getProducts(),
  getProduct: (id) => productsApi.getProduct(id),
  searchProducts: (query) => productsApi.searchProducts(query),
  getProductsByCategory: (category) => productsApi.getProductsByCategory(category),
  getCategories: () => productsApi.getCategories(),

  // Usuarios
  getUsers: async () => {
    const response = await fetch(`${API_URL}/users`);
    return response.json();
  },

  createUser: async (userData) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  loginUser: async (email, password) => {
    const response = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
    const users = await response.json();
    return users.length > 0 ? users[0] : null;
  },

  // Carrito
  getCart: async () => {
    const response = await fetch(`${API_URL}/cart`);
    return response.json();
  },

  addToCart: async (product) => {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    return response.json();
  },

  removeFromCart: async (id) => {
    const response = await fetch(`${API_URL}/cart/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  updateCartItem: async (id, data) => {
    const response = await fetch(`${API_URL}/cart/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  clearCart: async () => {
    const cartItems = await api.getCart();
    const deletePromises = cartItems.map(item => 
      fetch(`${API_URL}/cart/${item.id}`, { method: 'DELETE' })
    );
    await Promise.all(deletePromises);
  }
};

// Exportaciones individuales para compatibilidad
export const getProducts = () => productsApi.getProducts();
export const getProduct = (id) => productsApi.getProduct(id);
export const getCategories = () => productsApi.getCategories();
export const searchProducts = (query) => productsApi.searchProducts(query);
export const getProductsByCategory = (category) => productsApi.getProductsByCategory(category);
