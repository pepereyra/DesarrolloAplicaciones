const API_URL = 'http://localhost:3002';

export const api = {
  // Productos
  getProducts: async () => {
    const response = await fetch(`${API_URL}/products`);
    return response.json();
  },

  getProduct: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    return response.json();
  },

  searchProducts: async (query) => {
    const response = await fetch(`${API_URL}/products?title_like=${query}`);
    return response.json();
  },

  getProductsByCategory: async (category) => {
    const response = await fetch(`${API_URL}/products?category=${category}`);
    return response.json();
  },

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
