// Servicio para productos locales desde JSON

// Función helper para generar URLs de imágenes placeholder
const getProductImage = (categoria, nombre) => {
  const categoryMap = {
    'Anteojos de sol': { color: '3483fa', icon: '🕶️' },
    'Laptops': { color: '2d3436', icon: '💻' },
    'Freidoras de aire': { color: 'e17055', icon: '🔥' },
    'Televisores': { color: '74b9ff', icon: '📺' },
    'Electrodomésticos': { color: '00b894', icon: '🏠' }
  };
  
  const categoryInfo = categoryMap[categoria] || { color: '6c5ce7', icon: '🛍️' };
  const encodedIcon = encodeURIComponent(categoryInfo.icon);
  const encodedName = encodeURIComponent(nombre.slice(0, 20));
  
  return `https://via.placeholder.com/300x300/${categoryInfo.color}/ffffff?text=${encodedIcon}+${encodedName}`;
};

export const localProductsService = {
  getProducts: async () => {
    try {
      const response = await fetch('/data/products.json');
      if (!response.ok) {
        throw new Error('Error al cargar productos locales');
      }
      const products = await response.json();
      
      // Mapear estructura local a estructura existente del proyecto
      return products.map(product => ({
        id: product.id,
        title: product.nombre,
        price: product.precio,
        currency: 'ARS',
        condition: 'new',
        free_shipping: product.precio > 100000, // Envío gratis para productos > $100k
        installments: {
          quantity: product.precio > 200000 ? 12 : 6,
          amount: Math.round(product.precio / (product.precio > 200000 ? 12 : 6))
        },
        thumbnail: getProductImage(product.categoria, product.nombre),
        category: product.categoria,
        seller: {
          nickname: 'MERCADOLIBRE_OFICIAL',
          reputation: 'gold'
        },
        location: 'Capital Federal',
        description: product.descripcion,
        stock: product.stock,
        tags: product.stock > 15 ? ['Stock disponible'] : product.stock === 0 ? ['Sin stock'] : ['Últimas unidades'],
        // Mantener campos originales para compatibilidad
        nombre: product.nombre,
        categoria: product.categoria,
        descripcion: product.descripcion,
        precio: product.precio,
        imagen: product.imagen
      }));
    } catch (error) {
      console.error('Error loading local products:', error);
      throw error;
    }
  },

  getProduct: async (id) => {
    try {
      const products = await localProductsService.getProducts();
      const product = products.find(p => p.id === id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return product;
    } catch (error) {
      console.error('Error loading product:', error);
      throw error;
    }
  },

  getProductsByCategory: async (category) => {
    try {
      const products = await localProductsService.getProducts();
      return products.filter(product => product.category === category);
    } catch (error) {
      console.error('Error filtering products by category:', error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const products = await localProductsService.getProducts();
      const categories = [...new Set(products.map(p => p.category))];
      return categories.sort();
    } catch (error) {
      console.error('Error loading categories:', error);
      throw error;
    }
  },

  searchProducts: async (query) => {
    try {
      const products = await localProductsService.getProducts();
      const searchTerm = query.toLowerCase();
      return products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
};

// Utilidades para productos
export const productUtils = {
  formatPrice: (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  },

  formatPriceCompact: (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  },

  isOutOfStock: (product) => {
    return product.stock === 0;
  },

  canAddToCart: (product, currentQuantityInCart = 0) => {
    return product.stock > 0 && currentQuantityInCart < product.stock;
  },

  getAvailableStock: (product, currentQuantityInCart = 0) => {
    return Math.max(0, product.stock - currentQuantityInCart);
  }
};
