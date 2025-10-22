import { localProductsService } from './localProductsService.js';

const API_URL = 'http://localhost:8080/api';

// Configuración para manejar errores
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }
  return await response.json();
};

// Función para mapear productos del backend al formato del frontend
const mapProductFromBackend = (backendProduct) => {
  return {
    id: backendProduct.id,
    title: backendProduct.nombre,
    price: backendProduct.precio,
    currency: 'ARS',
    condition: 'new',
    freeShipping: true,
    thumbnail: backendProduct.imagenes && backendProduct.imagenes.length > 0 
      ? backendProduct.imagenes[0] 
      : 'https://via.placeholder.com/150',
    category: backendProduct.categoria,
    seller: {
      id: '1',
      nickname: backendProduct.vendedorNombre || 'Vendedor'
    },
    location: 'Buenos Aires',
    description: backendProduct.descripcion,
    stock: 100,
    images: backendProduct.imagenes || [],
    isFavorite: backendProduct.esFavorito || false
  };
};

// API para productos conectada al backend Spring Boot
export const productsApi = {
  getProducts: async () => {
    try {
      const response = await fetch(`${API_URL}/productos?size=100`);
      const data = await handleResponse(response);
      
      // El backend devuelve una estructura paginada: { content: [...], totalElements: 20, ... }
      const products = data.content || [];
      
      // Mapear los productos al formato esperado por el frontend
      return products.map(mapProductFromBackend);
    } catch (error) {
      console.error('Error fetching products:', error);
      return []; // Retornar array vacío en caso de error
    }
  },

  getProduct: async (id) => {
    try {
      const response = await fetch(`${API_URL}/productos/${id}`);
      const backendProduct = await handleResponse(response);
      
      // Mapear el producto al formato del frontend
      return mapProductFromBackend(backendProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  getProductsByCategory: async (category) => {
    try {
      const response = await fetch(`${API_URL}/productos/categoria/${encodeURIComponent(category)}?size=100`);
      const data = await handleResponse(response);
      
      // El backend devuelve una estructura paginada
      const products = data.content || [];
      
      // Mapear los productos al formato esperado por el frontend
      return products.map(mapProductFromBackend);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  getCategories: async () => {
    try {
      // Obtener productos primero
      const productsData = await productsApi.getProducts();
      
      console.log('Products data for categories:', productsData); // Debug log
      
      // Verificar que sea un array
      if (!Array.isArray(productsData)) {
        console.warn('Products data is not an array:', productsData);
        return [];
      }
      
      // Extraer categorías únicas de los productos (ahora mapeados con campo 'category')
      const categories = [...new Set(productsData.map(product => product.category))];
      
      // Filtrar valores nulos/undefined y retornar
      const validCategories = categories.filter(cat => cat && cat.trim() !== '');
      console.log('Valid categories found:', validCategories); // Debug log
      
      return validCategories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  searchProducts: async (query) => {
    try {
      const response = await fetch(`${API_URL}/productos/search?q=${encodeURIComponent(query)}&size=100`);
      const data = await handleResponse(response);
      
      // El backend devuelve una estructura paginada
      const products = data.content || [];
      
      // Mapear los productos al formato esperado por el frontend
      return products.map(mapProductFromBackend);
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
};

// API de autenticación
export const authApi = {
  loginUser: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  getUsers: async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
};

// API de carrito
export const cartApi = {
  getCart: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/carrito`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching cart:', error);
      return [];
    }
  },

  addToCart: async (product) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/carrito/agregar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productoId: product.id,
          cantidad: product.quantity || 1
        }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  removeFromCart: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/carrito/eliminar/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  updateCartItem: async (id, data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/carrito/actualizar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...data }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/carrito/limpiar`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};

// API principal manteniendo compatibilidad
export const api = {
  getProducts: () => productsApi.getProducts(),
  getProduct: (id) => productsApi.getProduct(id),
  searchProducts: (query) => productsApi.searchProducts(query),
  getProductsByCategory: (category) => productsApi.getProductsByCategory(category),
  getCategories: () => productsApi.getCategories(),
  getUsers: () => authApi.getUsers(),
  createUser: (userData) => authApi.createUser(userData),
  loginUser: (email, password) => authApi.loginUser(email, password),
  getCart: () => cartApi.getCart(),
  addToCart: (product) => cartApi.addToCart(product),
  removeFromCart: (id) => cartApi.removeFromCart(id),
  updateCartItem: (id, data) => cartApi.updateCartItem(id, data),
  clearCart: () => cartApi.clearCart(),
  
  createProduct: async (productData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

// Exportaciones individuales para compatibilidad
export const getProducts = () => productsApi.getProducts();
export const getProduct = (id) => productsApi.getProduct(id);
export const getCategories = () => productsApi.getCategories();
export const searchProducts = (query) => productsApi.searchProducts(query);
