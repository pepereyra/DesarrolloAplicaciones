import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, getCategories } from '../services/api';
import Notification from '../components/Notification';
import './SellerPanel.css';

function SellerPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, getSellerInfo } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // 'list' o 'form'
  
  // Debug: observar cambios en currentView
  useEffect(() => {
    console.log('currentView cambió a:', currentView);
  }, [currentView]);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    thumbnail: '',
    images: [''], // Array de URLs de imágenes
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
    loadCategories();
  }, [currentUser, navigate, getSellerInfo]);

  // useEffect para manejar cuando se llega desde ProductDetail con un producto para editar
  useEffect(() => {
    console.log('SellerPanel useEffect editProduct - location.state:', location.state);
    if (location.state?.editProduct) {
      const productToEdit = location.state.editProduct;
      console.log('Producto para editar recibido:', productToEdit);
      setSelectedProduct(productToEdit);
      setCurrentView('form');
      setFormData({
        title: productToEdit.title || '',
        price: productToEdit.price?.toString() || '',
        description: productToEdit.description || '',
        category: productToEdit.category || '',
        thumbnail: productToEdit.thumbnail || '',
        images: productToEdit.images?.length > 0 ? productToEdit.images : [''],
        stock: productToEdit.stock?.toString() || '',
        condition: productToEdit.condition || 'new',
        free_shipping: productToEdit.free_shipping || false,
        location: productToEdit.location || '',
        tags: productToEdit.tags?.join(', ') || ''
      });
      
      // Limpiar el estado de navegación después de procesar
      setTimeout(() => {
        navigate('/vender', { replace: true, state: {} });
      }, 100);
    }
  }, [location.state?.editProduct, navigate]);

  const loadSellerProducts = async () => {
    try {
      setLoading(true);
      // Usar el endpoint específico del vendedor en lugar de filtrar todos los productos
      const sellerProducts = await api.getProductsByVendedor(currentUser.id);
      setProducts(sellerProducts);
    } catch (error) {
      console.error('Error loading seller products:', error);
      showNotification('Error al cargar productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categorias = await getCategories();
      setCategories(categorias);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
      // Mostrar notificación de error
      showNotification('Error al cargar categorías. Verifique la conexión con el servidor.', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Funciones para manejar múltiples imágenes
  const handleImageUrlChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages,
      // Actualizar thumbnail con la primera imagen válida
      thumbnail: newImages.find(url => url.trim() !== '') || ''
    }));
  };

  const addImageUrl = () => {
    if (formData.images.length < 8) { // Máximo 8 imágenes
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, '']
      }));
    }
  };

  const removeImageUrl = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        images: newImages,
        thumbnail: newImages.find(url => url.trim() !== '') || ''
      }));
    }
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
      
      // Crear información del vendedor si no existe
      const currentSellerInfo = sellerInfo || {
        nickname: `${currentUser.firstName}_STORE`,
        reputation: 'bronze',
        location: 'Argentina'
      };
      
      console.log('Using Seller Info:', currentSellerInfo);
      
      console.log('Form Data:', formData);
      
      // Preparar datos del producto
      const validImages = formData.images.filter(url => url.trim() !== '');
      
      // Validar máximo de imágenes (opcional: 0-8)
      if (validImages.length > 8) {
        showNotification('Máximo 8 imágenes permitidas por producto', 'error');
        return;
      }
      
      const productData = {
        ...formData,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
        sellerId: currentUser.id,
        seller: {
          nickname: currentSellerInfo.nickname || `${currentUser.firstName}_STORE`,
          reputation: currentSellerInfo.reputation || 'bronze'
        },
        location: formData.location || currentSellerInfo.location || 'Argentina',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        images: validImages,
        thumbnail: validImages.length > 0 ? validImages[0] : null, // null si no hay imágenes
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
    setCurrentView('form'); // Cambiar a vista de formulario
    setFormData({
      title: product.title || '',
      price: product.price?.toString() || '',
      description: product.description || '',
      category: product.category || '',
      thumbnail: product.thumbnail || '',
      images: product.images?.length > 0 ? product.images : [''],
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
    setCurrentView('list'); // Volver a la vista de lista
    setFormData({
      title: '',
      price: '',
      description: '',
      category: '',
      thumbnail: '',
      images: [''],
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
        
        {/* Navegación entre vistas */}
        <div className="view-navigation">
          <button 
            className={`nav-btn ${currentView === 'list' ? 'active' : ''}`}
            onClick={() => {
              console.log('Navegando a vista de lista');
              setCurrentView('list');
            }}
          >
            📋 Mis Productos ({products.length})
          </button>
          <button 
            className={`nav-btn ${currentView === 'form' ? 'active' : ''}`}
            onClick={() => {
              console.log('Navegando a vista de formulario');
              setCurrentView('form');
              if (selectedProduct) {
                resetForm(); // Limpiar si había un producto seleccionado
              }
            }}
          >
            ➕ {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
          </button>
        </div>
      </div>

      <div className="seller-content">
        {currentView === 'form' ? (
          // Vista del formulario
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
                disabled={categories.length === 0}
              >
                <option value="">
                  {categories.length === 0 
                    ? "No se pudieron cargar las categorías" 
                    : "Seleccionar categoría *"
                  }
                </option>
                {categories.map((categoria) => (
                  <option key={categoria.id} value={categoria.name}>
                    {categoria.name}
                  </option>
                ))}
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

            {/* Sección de imágenes múltiples */}
            <div className="images-section">
              <h4>Imágenes del producto</h4>
              <p className="images-help">Agrega hasta 8 imágenes de tu producto (opcional). La primera imagen será la principal.</p>
              
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="image-url-row">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    placeholder={index === 0 ? "URL de la imagen principal (opcional)" : `URL de imagen ${index + 1} (opcional)`}
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      className="remove-image-btn"
                      title="Eliminar imagen"
                    >
                      ❌
                    </button>
                  )}
                  {imageUrl && (
                    <div className="image-preview">
                      <img 
                        src={imageUrl} 
                        alt={`Preview ${index + 1}`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                        onLoad={(e) => {
                          e.target.style.display = 'block';
                        }}
                      />
                      {index === 0 && <span className="main-badge">Principal</span>}
                    </div>
                  )}
                </div>
              ))}
              
              {formData.images.length < 8 && (
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="add-image-btn"
                >
                  ➕ Agregar otra imagen
                </button>
              )}
            </div>

            <div className="form-row">
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
        ) : (
          // Vista de lista de productos
          <div className="products-list-section">
            <h3>Mis Productos ({products.length})</h3>
            {loading && <p>Cargando productos...</p>}
            
            {!loading && products.length === 0 && (
              <div className="no-products">
                <p>Aún no tienes productos en venta.</p>
                <p>¡Crea tu primer producto con el botón "Nuevo Producto"!</p>
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
        )}
      </div>
    </div>
  );
}

export default SellerPanel;