import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Notification from '../components/Notification';
import './AdminPanel.css';

function AdminPanel() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
    stock: ''
  });

  useEffect(() => {
    // Verificar si el usuario es administrador
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
      return;
    }
    loadProducts();
  }, [currentUser, navigate]);

  const loadProducts = async () => {
    try {
      const products = await api.getProducts();
      setProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        // Actualizar producto
        await api.updateProduct(selectedProduct.id, formData);
        showNotification('Producto actualizado correctamente');
      } else {
        // Crear nuevo producto
        await api.createProduct(formData);
        showNotification('Producto creado correctamente');
      }
      loadProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      showNotification(
        error.message || 'Error al guardar el producto. Por favor, inténtalo de nuevo.',
        'error'
      );
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      stock: product.stock
    });
  };

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await api.deleteProduct(productId);
        loadProducts();
        showNotification('Producto eliminado correctamente');
      } catch (error) {
        console.error('Error deleting product:', error);
        showNotification(
          error.message || 'Error al eliminar el producto. Por favor, inténtalo de nuevo.',
          'error'
        );
      }
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setFormData({
      title: '',
      price: '',
      description: '',
      category: '',
      image: '',
      stock: ''
    });
  };

  return (
    <div className="admin-panel">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <h2>{selectedProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Título del producto"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Precio"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Descripción"
          required
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          placeholder="Categoría"
          required
        />
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          placeholder="URL de la imagen (opcional)"
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleInputChange}
          placeholder="Stock disponible"
          required
        />
        <div className="form-buttons">
          <button type="submit">
            {selectedProduct ? 'Actualizar' : 'Crear'}
          </button>
          {selectedProduct && (
            <button type="button" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="products-list">
        <h3>Productos Existentes</h3>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card admin">
              <img src={product.image} alt={product.title} />
              <h4>{product.title}</h4>
              <p>Precio: ${product.price}</p>
              <p>Stock: {product.stock}</p>
              <div className="admin-buttons">
                <button onClick={() => handleEdit(product)}>
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="delete"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
