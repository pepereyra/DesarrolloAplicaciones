// URL base de la API (json-server)
const API_BASE_URL = 'http://localhost:3001';

// Servicio para obtener todos los productos
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener productos: ${response.status}`);
    }
    
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error en getProducts:', error);
    throw error;
  }
};

// Servicio para obtener un producto por ID
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener producto ${id}: ${response.status}`);
    }
    
    const product = await response.json();
    return product;
  } catch (error) {
    console.error(`Error en getProductById(${id}):`, error);
    throw error;
  }
};

// Servicio para obtener productos por categoría
export const getProductsByCategory = async (category) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products?category=${category}`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener productos de categoría ${category}: ${response.status}`);
    }
    
    const products = await response.json();
    return products;
  } catch (error) {
    console.error(`Error en getProductsByCategory(${category}):`, error);
    throw error;
  }
};
