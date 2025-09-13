import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Notification from '../components/Notification';
import './SellerPanel.css';

function SellerPanel() {
  const navigate = useNavigate();
  const { currentUser, getSellerInfo } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    thumbnail: '',
    stock: '',
    condition: 'new',
    free_shipping: false,
    location: '',
    tags: ''
  });

  useEffect(() => {
    // Verificar si el usuario está logueado
    console.log('SellerPanel useEffect - Current User:', currentUser);
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const currentSellerInfo = getSellerInfo();
    console.log('SellerPanel useEffect - Seller Info:', currentSellerInfo);
    setSellerInfo(currentSellerInfo);
    
    loadSellerProducts();
  }, [currentUser, navigate, getSellerInfo]);

  const loadSellerProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await api.getProducts();
      // Filtrar solo los productos del vendedor actual
      const sellerProducts = allProducts.filter(product => product.sellerId === currentUser.id);
      setProducts(sellerProducts);
    } catch (error) {
      console.error('Error loading seller products:', error);
      showNotification('Error al cargar productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      console.log('Current User:', currentUser);
      console.log('Seller Info from state:', sellerInfo);
      
      // Validar que tenemos la información del vendedor
      if (!sellerInfo) {
        throw new Error('No se pudo obtener la información del vendedor');
      }
      
      console.log('Form Data:', formData);
      
      // Preparar datos del producto
      const productData = {
        ...formData,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
        sellerId: currentUser.id,
        seller: {
          nickname: sellerInfo.nickname || `${currentUser.firstName}_STORE`,
          reputation: sellerInfo.reputation || 'bronze'
        },
        location: formData.location || sellerInfo.location || 'Argentina',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        images: formData.thumbnail ? [formData.thumbnail] : [],
        currency: 'ARS',
        installments: {
          quantity: 12,
          amount: Math.round(parseInt(formData.price) / 12)
        }
      };

      console.log('Product Data:', productData);

      if (selectedProduct) {
        // Actualizar producto
        await api.updateProduct(selectedProduct.id, productData);
        showNotification('Producto actualizado correctamente');
      } else {
        // Crear nuevo producto
        await api.createProduct(productData);
        showNotification('Producto creado correctamente');
      }
      
      loadSellerProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      showNotification(
        error.message || 'Error al guardar el producto. Por favor, inténtalo de nuevo.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title || '',
      price: product.price?.toString() || '',
      description: product.description || '',
      category: product.category || '',
      thumbnail: product.thumbnail || '',
      stock: product.stock?.toString() || '',
      condition: product.condition || 'new',
      free_shipping: product.free_shipping || false,
      location: product.location || '',
      tags: product.tags?.join(', ') || ''
    });
  };

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        setLoading(true);
        await api.deleteProduct(productId);
        loadSellerProducts();
        showNotification('Producto eliminado correctamente');
      } catch (error) {
        console.error('Error deleting product:', error);
        showNotification(
          error.message || 'Error al eliminar el producto. Por favor, inténtalo de nuevo.',
          'error'
        );
      } finally {
        setLoading(false);
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
      thumbnail: '',
      stock: '',
      condition: 'new',
      free_shipping: false,
      location: '',
      tags: ''
    });
  };

  return (
    <div className="seller-panel">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="seller-header">
        <h2>Panel de Vendedor</h2>
        {sellerInfo ? (
          <div className="seller-info">
            <h3>Tienda: {sellerInfo.nickname || `${currentUser?.firstName || 'Mi'}_STORE`}</h3>
            <span className={`reputation ${sellerInfo.reputation || 'bronze'}`}>
              {sellerInfo.reputation === 'gold' ? '⭐ Gold' : 
               sellerInfo.reputation === 'silver' ? '🥈 Silver' : '🥉 Bronze'}
            </span>
          </div>
        ) : (
          <div className="seller-info">
            <h3>Tienda: {currentUser?.firstName || 'Mi'}_STORE</h3>
            <span className="reputation bronze">🥉 Bronze</span>
          </div>
        )}
      </div>

      <div className="seller-content">
        <div className="product-form-section">
          <h3>{selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <form onSubmit={handleSubmit} className="seller-form">
            <div className="form-row">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Título del producto *"
                required
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Precio (ARS) *"
                min="0"
                required
              />
            </div>

            <div className="form-row">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar categoría *</option>
                <option value="celulares">Celulares</option>
                <option value="computacion">Computación</option>
                <option value="electrodomesticos">Electrodomésticos</option>
                <option value="deportes">Deportes</option>
                <option value="audio">Audio</option>
                <option value="anteojos">Anteojos</option>
              </select>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
              >
                <option value="new">Nuevo</option>
                <option value="used">Usado</option>
                <option value="refurbished">Reacondicionado</option>
              </select>
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descripción del producto *"
              rows="4"
              required
            />

            <div className="form-row">
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                placeholder="URL de la imagen principal"
              />
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="Stock disponible *"
                min="0"
                required
              />
            </div>

            <div className="form-row">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ubicación (opcional)"
              />
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Etiquetas (separadas por comas)"
              />
            </div>

            <div className="checkbox-row">
              <label>
                <input
                  type="checkbox"
                  name="free_shipping"
                  checked={formData.free_shipping}
                  onChange={handleInputChange}
                />
                <span>Envío gratis</span>
              </label>
            </div>

            <div className="form-buttons">
              <button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : (selectedProduct ? 'Actualizar' : 'Crear Producto')}
              </button>
              {selectedProduct && (
                <button type="button" onClick={resetForm} disabled={loading}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="products-list-section">
          <h3>Mis Productos ({products.length})</h3>
          {loading && <p>Cargando productos...</p>}
          
          {!loading && products.length === 0 && (
            <div className="no-products">
              <p>Aún no tienes productos en venta.</p>
              <p>¡Crea tu primer producto arriba!</p>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card seller">
                  <div className="product-image">
                    {product.thumbnail ? (
                      <img src={product.thumbnail} alt={product.title} />
                    ) : (
                      <div className="no-image">Sin imagen</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h4>{product.title}</h4>
                    <p className="price">${product.price?.toLocaleString()} ARS</p>
                    <p className="stock">Stock: {product.stock}</p>
                    <p className="category">{product.category}</p>
                    {product.tags && product.tags.length > 0 && (
                      <div className="tags">
                        {product.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="product-actions">
                    <button onClick={() => handleEdit(product)} disabled={loading}>
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="delete"
                      disabled={loading}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerPanel;