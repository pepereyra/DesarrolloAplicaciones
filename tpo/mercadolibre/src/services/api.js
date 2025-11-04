const API_URL = 'http://localhost:8080/api';

// Función helper para obtener los headers con autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Configuración para manejar errores
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }
  
  // Si la respuesta no tiene contenido (como en DELETE), retornar null
  const contentType = response.headers.get('content-type');
  if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
    return null;
  }
  
  // Solo intentar parsear JSON si hay contenido
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

// Función para mapear productos del backend al formato del frontend
const mapProductFromBackend = (backendProduct) => {
  return {
    id: backendProduct.id,
    title: backendProduct.title,
    price: backendProduct.price,
    currency: backendProduct.currency || 'ARS',
    condition: backendProduct.condition || 'new',
    freeShipping: backendProduct.freeShipping || false,
    thumbnail: backendProduct.thumbnail || 
      (backendProduct.images && backendProduct.images.length > 0 
        ? backendProduct.images[0] 
        : 'https://via.placeholder.com/150'),
    category: backendProduct.categoria ? backendProduct.categoria.name : backendProduct.category,
    categoryId: backendProduct.categoria ? backendProduct.categoria.id : null,
    categoryData: backendProduct.categoria || null, // Objeto completo de categoría
    seller: backendProduct.seller || {
      id: backendProduct.sellerId || '1',
      nickname: 'Vendedor'
    },
    sellerId: backendProduct.sellerId, // ¡IMPORTANTE! Agregar este campo
    location: backendProduct.location || 'Buenos Aires',
    description: backendProduct.description,
    stock: backendProduct.stock || 100,
    images: backendProduct.images || [],
    tags: backendProduct.tags || [],
    installments: backendProduct.installments,
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
      // Usar el nuevo endpoint de categorías
      const response = await fetch(`${API_URL}/categorias`);
      const categorias = await handleResponse(response);
      
      console.log('Categories from API:', categorias); // Debug log
      
      // Verificar que sea un array
      if (!Array.isArray(categorias)) {
        console.warn('Categories data is not an array:', categorias);
        throw new Error('Invalid categories data format');
      }
      
      // Retornar las categorías completas (con id, name, description, image)
      return categorias;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // No hacer fallback - dejar que falle
      throw error;
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/categorias/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching category by id:', error);
      return null;
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
  },

  getProductsByVendedor: async (vendedorId) => {
    try {
      const response = await fetch(`${API_URL}/productos/vendedor/${vendedorId}?size=100`);
      const data = await handleResponse(response);
      
      // El backend devuelve una estructura paginada
      const products = data.content || [];
      
      // Mapear los productos al formato esperado por el frontend
      return products.map(mapProductFromBackend);
    } catch (error) {
      console.error('Error fetching products by vendedor:', error);
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
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },
  
  getUserById: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${userId}`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }
};

// API de carrito - Integrada con endpoints del CarritoController
export const cartApi = {
  /**
   * Obtener el carrito de un usuario específico
   * Endpoint: GET /api/carrito/{usuarioId}
   */
  getCart: async (usuarioId) => {
    try {
      const response = await fetch(`${API_URL}/carrito/${usuarioId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Retornar estructura vacía en caso de error (usuario sin carrito)
      return {
        id: null,
        usuarioId,
        items: [],
        totalPrice: 0,
        totalItems: 0,
        createdAt: null,
        updatedAt: null
      };
    }
  },

  /**
   * Agregar un item al carrito
   * Endpoint: POST /api/carrito/{usuarioId}/items?productoId=X&cantidad=Y
   */
  addToCart: async (usuarioId, productoId, cantidad = 1) => {
    try {
      const response = await fetch(`${API_URL}/carrito/${usuarioId}/items?productoId=${productoId}&cantidad=${cantidad}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  /**
   * Actualizar cantidad de un item en el carrito
   * Endpoint: PUT /api/carrito/{usuarioId}/items/{itemId}?cantidad=Z
   */
  updateCartItem: async (usuarioId, itemId, cantidad) => {
    try {
      const response = await fetch(`${API_URL}/carrito/${usuarioId}/items/${itemId}?cantidad=${cantidad}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  /**
   * Eliminar un item específico del carrito
   * Endpoint: DELETE /api/carrito/{usuarioId}/items/{itemId}
   */
  removeFromCart: async (usuarioId, itemId) => {
    try {
      const response = await fetch(`${API_URL}/carrito/${usuarioId}/items/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  /**
   * Vaciar completamente el carrito
   * Endpoint: DELETE /api/carrito/{usuarioId}
   */
  clearCart: async (usuarioId) => {
    try {
      const response = await fetch(`${API_URL}/carrito/${usuarioId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
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
  getProductsByVendedor: (vendedorId) => productsApi.getProductsByVendedor(vendedorId),
  getCategories: () => productsApi.getCategories(),
  getUsers: () => authApi.getUsers(),
  getUserById: (userId) => authApi.getUserById(userId),
  createUser: (userData) => authApi.createUser(userData),
  loginUser: (email, password) => authApi.loginUser(email, password),
  
  // Métodos de carrito actualizados para usar usuarioId
  getCart: (usuarioId) => cartApi.getCart(usuarioId),
  addToCart: (usuarioId, productoId, cantidad) => cartApi.addToCart(usuarioId, productoId, cantidad),
  removeFromCart: (usuarioId, itemId) => cartApi.removeFromCart(usuarioId, itemId),
  updateCartItem: (usuarioId, itemId, cantidad) => cartApi.updateCartItem(usuarioId, itemId, cantidad),
  clearCart: (usuarioId) => cartApi.clearCart(usuarioId),
  
  createProduct: async (productData) => {
    try {
      const response = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        headers: getAuthHeaders(),
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
      const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
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
      const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
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
export const getCategoryById = (id) => productsApi.getCategoryById(id);
export const searchProducts = (query) => productsApi.searchProducts(query);
