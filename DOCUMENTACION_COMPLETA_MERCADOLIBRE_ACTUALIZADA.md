# DOCUMENTACIÓN COMPLETA - PROYECTO MERCADO LIBRE CLONE

## 📋 ÍNDICE
1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Tecnologías y Dependencias](#tecnologías-y-dependencias)
3. [JSON Server y Base de Datos](#json-server-y-base-de-datos)
4. [Contextos y Estado Global](#contextos-y-estado-global)
5. [Hooks Personalizados](#hooks-personalizados)
6. [Servicios y API](#servicios-y-api)
7. [Rutas y Navegación](#rutas-y-navegación)
8. [Flujos de Trabajo Detallados - PRODUCTOS](#flujos-de-trabajo-detallados---productos)
9. [Flujos de Trabajo Detallados - GESTIÓN DE PRODUCTOS](#flujos-de-trabajo-detallados---gestión-de-productos)
10. [Flujos de Trabajo Detallados - USUARIOS](#flujos-de-trabajo-detallados---usuarios)
11. [Flujos de Trabajo Detallados - CARRITO](#flujos-de-trabajo-detallados---carrito)
12. [Flujos de Trabajo Detallados - FAVORITOS](#flujos-de-trabajo-detallados---favoritos)
13. [Componentes por Funcionalidad](#componentes-por-funcionalidad)
14. [Manejo de Estado Local](#manejo-de-estado-local)

---

## 📁 ESTRUCTURA DEL PROYECTO

```
mercadolibre/
├── public/
│   ├── placeholder-image.svg     # Imagen por defecto para productos sin foto
│   ├── vite.svg                  # Logo de Vite
│   └── data/
│       └── products.json         # Productos locales de fallback
├── src/
│   ├── components/               # Componentes reutilizables
│   │   ├── BannerCarousel.jsx    # Carrusel de banners publicitarios
│   │   ├── CategoryDropdown.jsx  # Selector de categorías
│   │   ├── CategoryFilter.jsx    # Filtros por categoría
│   │   ├── FavoriteButton.jsx    # Botón de favoritos
│   │   ├── Header.jsx            # Cabecera principal con búsqueda
│   │   ├── Login.jsx             # Formulario de login
│   │   ├── Notification.jsx      # Sistema de notificaciones
│   │   ├── ProductCard.jsx       # Tarjeta de producto individual
│   │   ├── ProductGrid.jsx       # Grilla de productos
│   │   ├── ProtectedRoute.jsx    # Rutas protegidas por autenticación
│   │   └── Register.jsx          # Formulario de registro
│   ├── context/                  # Contextos para estado global
│   │   ├── AppContext.jsx        # Estado de aplicación y carrito
│   │   ├── AuthContext.jsx       # Autenticación y sesiones
│   │   └── FavoritesContext.jsx  # Gestión de favoritos
│   ├── hooks/                    # Hooks personalizados
│   │   ├── useCart.js            # Lógica del carrito de compras
│   │   └── useForm.js            # Manejo de formularios
│   ├── pages/                    # Páginas principales
│   │   ├── Cart.jsx              # Página del carrito
│   │   ├── Category.jsx          # Vista por categoría
│   │   ├── Favorites.jsx         # Página de favoritos
│   │   ├── Home.jsx              # Página de inicio
│   │   ├── ProductDetail.jsx     # Detalle del producto
│   │   ├── Profile.jsx           # Perfil de usuario
│   │   ├── Search.jsx            # Página de búsqueda
│   │   ├── SellerPanel.jsx       # Panel de vendedor
│   │   └── SellerProfile.jsx     # Perfil público de vendedor
│   ├── services/                 # Servicios para comunicación con API
│   │   ├── api.js                # API principal (JSON Server)
│   │   └── localProductsService.js # Fallback a datos locales
│   ├── utils/                    # Utilidades
│   │   └── searchHistory.js      # Historial de búsquedas por usuario
│   ├── assets/                   # Recursos estáticos
│   │   ├── images.png            # Imagen promocional
│   │   ├── mercado libre.png     # Logo original de MercadoLibre
│   │   ├── mercado libre 2.0.png # Logo actualizado
│   │   └── react.svg             # Logo de React
│   ├── App.jsx                   # Componente raíz con Router
│   └── main.jsx                  # Punto de entrada de la aplicación
├── db.json                       # Base de datos JSON Server
├── package.json                  # Dependencias y scripts
├── STATUS_FINAL.md               # Estado final del proyecto
├── TESTING_GUIDE.md              # Guía de pruebas
├── BUTTON_IMPROVEMENTS.md        # Mejoras de diseño
├── IMPLEMENTATION_README.md      # Detalles de implementación
└── GIT_INSTRUCTIONS.md           # Instrucciones de git
```

**Arquitectura de carpetas:**
- **components/**: Componentes reutilizables sin estado específico de página
- **pages/**: Componentes que representan páginas completas
- **context/**: Proveedores de estado global con useContext
- **hooks/**: Lógica reutilizable extraída en custom hooks
- **services/**: Comunicación con APIs externas
- **utils/**: Funciones de utilidad pura

---

## 🛠️ TECNOLOGÍAS Y DEPENDENCIAS

### **Dependencias principales:**
```json
{
  "react": "^19.1.1",           // Framework principal de UI
  "react-dom": "^19.1.1",      // DOM renderer para React
  "react-router-dom": "^7.8.2"  // Enrutamiento SPA
}
```

### **Herramientas de desarrollo:**
```json
{
  "vite": "^7.1.2",             // Build tool y dev server
  "eslint": "^9.33.0",          // Linting de código
  "json-server": "^1.0.0-beta.3" // Mock API REST
}
```

### **Scripts disponibles:**
```bash
npm run dev     # Servidor de desarrollo (puerto 5173)
npm run build   # Build para producción
npm run server  # JSON Server en puerto 3000
npm run lint    # Linting del código
npm run preview # Preview del build
```

### **Configuración de puertos:**
- **Frontend (Vite)**: http://localhost:5173/
- **Backend (JSON Server)**: http://localhost:3000/

---

## 🗃️ JSON SERVER Y BASE DE DATOS

### **Configuración en package.json:**
```json
"server": "json-server --watch db.json --port 3000"
```

### **Estructura de db.json:**
```json
{
  "products": [
    {
      "id": "1",
      "title": "iPhone 15 Pro Max",
      "price": 450000,
      "currency": "ARS",
      "condition": "new",
      "free_shipping": true,
      "installments": {
        "quantity": 12,
        "amount": 37500
      },
      "thumbnail": "https://http2.mlstatic.com/D_Q_NP_123456.jpg",
      "images": [
        "https://http2.mlstatic.com/D_Q_NP_123456.jpg",
        "https://http2.mlstatic.com/D_Q_NP_123457.jpg"
      ],
      "category": "Celulares",
      "sellerId": "user123",
      "seller": {
        "nickname": "APPLE_STORE_ARG",
        "reputation": "gold"
      },
      "location": "Capital Federal",
      "description": "iPhone 15 Pro Max con chip A17 Pro...",
      "stock": 50,
      "tags": ["apple", "iphone", "smartphone"]
    }
  ],
  "users": [
    {
      "id": "user123",
      "email": "usuario@example.com",
      "password": "123456",
      "firstName": "Juan",
      "lastName": "Pérez",
      "role": "user",
      "avatar": "https://via.placeholder.com/150",
      "sellerProfile": {
        "nickname": "JUAN_STORE",
        "reputation": "bronze",
        "description": "Tienda de Juan Pérez",
        "location": "Argentina",
        "phone": "+54 11 0000-0000"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "cart": []
}
```

### **API Endpoints disponibles:**
```
GET    /products           - Lista todos los productos
GET    /products/{id}      - Producto específico por ID
GET    /products?category=X - Filtrar por categoría
GET    /products?q=search  - Búsqueda de productos
POST   /products           - Crear nuevo producto
PATCH  /products/{id}      - Actualizar producto
DELETE /products/{id}      - Eliminar producto

GET    /users              - Lista usuarios
POST   /users              - Crear usuario
GET    /users?email=X      - Buscar usuario por email

GET    /cart               - Obtener carrito global
POST   /cart               - Agregar al carrito
PATCH  /cart/{id}          - Actualizar item del carrito
DELETE /cart/{id}          - Eliminar del carrito
```

---

## 🌐 CONTEXTOS Y ESTADO GLOBAL

### **1. AuthContext.jsx**
**Propósito:** Manejo de autenticación, sesiones y perfiles de usuario

**Estado gestionado:**
```javascript
const [currentUser, setCurrentUser] = useState(loadUserFromStorage);
const [error, setError] = useState('');
```

**Métodos principales:**
- `register(userData)`: Registra nuevo usuario con auto-generación de perfil vendedor
- `login(email, password)`: Autenticación y establecimiento de sesión
- `logout()`: Limpieza de sesión y localStorage
- `isProductOwner(sellerId)`: Verifica propiedad de producto
- `canPurchaseProduct(sellerId)`: Valida si puede comprar (no sus propios productos)
- `getSellerInfo()`: Obtiene información del perfil de vendedor

**LocalStorage utilizado:**
- `currentUser`: Persistencia completa de la sesión del usuario

**Hooks internos:**
- `useState`: Para currentUser y error
- `useEffect`: Carga inicial desde localStorage y guardado automático
- `useContext`: Para exponer el contexto

**Llamadas asíncronas:**
- `register()`: POST a `/users` con validación de email único
- `login()`: GET a `/users?email=${email}` para autenticación
- `useEffect`: GET a `/users/${id}` para cargar datos completos del usuario

### **2. AppContext.jsx**
**Propósito:** Estado global de aplicación, carrito y productos

**Estado gestionado con useReducer:**
```javascript
const initialState = {
  cart: [],          // Items del carrito con cantidad
  products: [],      // Lista de productos cargados
  loading: false,    // Estado de carga para UI
  searchQuery: '',   // Query de búsqueda actual
  searchResults: []  // Resultados de búsqueda
};
```

**Acciones del Reducer:**
- `SET_LOADING`: Control de estados de carga
- `SET_PRODUCTS`: Establece lista completa de productos
- `ADD_TO_CART`: Agrega producto con validación de stock
- `REMOVE_FROM_CART`: Elimina producto del carrito
- `UPDATE_CART_QUANTITY`: Actualiza cantidad con límites de stock
- `CLEAR_CART`: Limpia carrito completamente
- `SET_SEARCH_QUERY`: Establece término de búsqueda
- `SET_SEARCH_RESULTS`: Guarda resultados de búsqueda
- `LOAD_CART`: Carga carrito desde localStorage

**LocalStorage estrategia:**
- `mercadolibre-cart-guest`: Carrito para usuarios no autenticados
- `mercadolibre-cart-{userId}`: Carrito específico por usuario
- **Merge automático**: Al hacer login combina carrito guest + usuario

**SessionStorage utilizado:**
- `pendingAddToCart`: Producto pendiente para agregar tras login

**Hooks internos:**
- `useReducer`: Para estado complejo del carrito
- `useEffect`: Para cargar/guardar carrito automáticamente
- `useState`: Para flag de inicialización

### **3. FavoritesContext.jsx**
**Propósito:** Gestión de productos favoritos por usuario

**Estado gestionado con useReducer:**
```javascript
{
  items: [],       // Lista de productos favoritos completos
  loading: false   // Estado de carga para UI
}
```

**Métodos principales:**
- `addToFavorites(product)`: Agrega producto a favoritos
- `removeFromFavorites(productId)`: Elimina por ID
- `isFavorite(productId)`: Verificación de estado
- `toggleFavorite(product)`: Alterna estado de favorito
- `getFavoritesCount()`: Contador para UI del header

**LocalStorage utilizado:**
- `favorites_{userId}`: Favoritos específicos por usuario autenticado

**Hooks internos:**
- `useReducer`: Para estado de favoritos
- `useEffect`: Para cargar/guardar favoritos automáticamente

---

## 🎣 HOOKS PERSONALIZADOS

### **1. useCart.js**
**Propósito:** Abstrae toda la lógica del carrito para reutilización

**Hook interno utilizado:**
- `useApp()`: Para acceder al estado global del carrito

**Métodos retornados:**
```javascript
{
  addToCart,           // (product, quantity=1) => void
  removeFromCart,      // (productId) => void  
  updateQuantity,      // (productId, newQuantity) => void
  clearCart,           // () => void
  getItemQuantity,     // (productId) => number
  canAddToCart,        // (product) => boolean
  getAvailableStock,   // (product) => number
  getSubtotal,         // () => number
  getShippingCost,     // () => number
  getTotal,            // () => number
  getTotalItems,       // () => number
  formatPrice          // (price) => string
}
```

**Lógica interna:**
- **Validación de stock**: Verifica disponibilidad antes de agregar
- **Cálculo automático**: Subtotales, envío y total
- **Formato de moneda**: ARS con separadores de miles
- **Límites de cantidad**: No exceder stock disponible

### **2. useForm.js**
**Propósito:** Manejo genérico de formularios con validación

**Parámetros:**
- `initialValues`: Objeto con valores iniciales del formulario
- `onSubmit`: Función callback para envío

**Estados retornados:**
```javascript
{
  formData,        // Objeto con datos actuales del formulario
  setFormData,     // Setter manual para casos específicos
  error,           // String con error actual
  setError,        // Setter para errores personalizados
  loading,         // Boolean de estado de envío
  handleChange,    // (e) => void - Maneja cambios en inputs
  handleSubmit     // (e) => void - Maneja envío del formulario
}
```

**Funcionalidad interna:**
- **Cambios automáticos**: `handleChange` actualiza formData automáticamente
- **Validación de envío**: Previene envíos dobles con loading
- **Manejo de errores**: Captura y muestra errores de envío

---

## 🔌 SERVICIOS Y API

### **api.js - Servicio Principal**
**Configuración:**
```javascript
const API_URL = 'http://localhost:3000';
```

**Estrategia de fallback:**
- **Primero**: Intenta JSON Server (puerto 3000)
- **Fallback**: Si falla, usa `localProductsService`

**Métodos para productos:**
```javascript
// GET /products
getProducts: async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    return await response.json();
  } catch (error) {
    return await localProductsService.getProducts();
  }
}

// GET /products/{id}  
getProduct: async (id) => { /* Similar pattern */ }

// GET /products?category=X
getProductsByCategory: async (category) => { /* Filter by category */ }

// GET con búsqueda
searchProducts: async (query) => { /* Search implementation */ }

// POST /products
createProduct: async (data) => { /* Create new product */ }

// PATCH /products/{id}
updateProduct: async (id, data) => { /* Update existing */ }

// DELETE /products/{id}
deleteProduct: async (id) => { /* Delete product */ }
```

**Métodos para usuarios:**
```javascript
// GET /users
getUsers: async () => { /* List all users */ }

// POST /users  
createUser: async (userData) => { /* Register new user */ }

// GET /users?email=X
loginUser: async (email, password) => { /* Authentication */ }
```

**Métodos para carrito:**
```javascript
// Carrito global en JSON Server (opcional)
getCart: async () => { /* GET /cart */ }
addToCart: async (product) => { /* POST /cart */ }
updateCartItem: async (id, data) => { /* PATCH /cart/{id} */ }
clearCart: async () => { /* DELETE all cart items */ }
```

**Características:**
- **Async/Await**: Todas las funciones son asíncronas
- **Error handling**: Try/catch con fallback automático
- **Consistent API**: Interfaz uniforme para todos los endpoints

---

## 🛣️ RUTAS Y NAVEGACIÓN

### **Configuración en App.jsx:**
```jsx
<Router>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/search" element={<Search />} />
    <Route path="/product/:id" element={<ProductDetail />} />
    <Route path="/producto/:id" element={<ProductDetail />} />
    <Route path="/cart" element={
      <ProtectedRoute><Cart /></ProtectedRoute>
    } />
    <Route path="/carrito" element={
      <ProtectedRoute><Cart /></ProtectedRoute>
    } />
    <Route path="/favorites" element={<Favorites />} />
    <Route path="/favoritos" element={<Favorites />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/vender" element={
      <ProtectedRoute><SellerPanel /></ProtectedRoute>
    } />
    <Route path="/vendedor/:sellerId" element={<SellerProfile />} />
    <Route path="/category/:category" element={<Category />} />
  </Routes>
</Router>
```

### **Rutas protegidas:**
- `/cart` y `/carrito`: Requieren autenticación
- `/vender`: Panel de vendedor requiere login

**ProtectedRoute.jsx:**
```jsx
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: location } });
    }
  }, [currentUser, navigate, location]);

  return currentUser ? children : null;
}
```

### **Hooks de navegación utilizados:**
- `useParams()`: Para obtener parámetros dinámicos (:id, :category, :sellerId)
- `useNavigate()`: Para navegación programática
- `useLocation()`: Para obtener ubicación actual y estado
- `useSearchParams()`: Para query parameters (?q=search)

### **Patrones de navegación:**
- **Parámetros dinámicos**: `/producto/:id` para detalle de productos
- **Query parameters**: `/search?q=termino` para búsquedas
- **Estado en navegación**: `navigate('/path', { state: { data } })` para pasar datos
- **Redirección con retorno**: Login preserva destino original

---

## 🚀 FLUJOS DE TRABAJO DETALLADOS - PRODUCTOS

### **1. PANTALLA DE INICIO (Home.jsx)**

**Componentes involucrados:**
- `Home.jsx` (página principal)
- `ProductCard.jsx` (tarjetas individuales) 
- `BannerCarousel.jsx` (carrusel promocional)
- `CategoryFilter.jsx` (filtros de categoría)

**Flujo paso a paso:**

1. **Inicialización del componente:**
   ```jsx
   function Home() {
     const { state, dispatch } = useApp();
     const [allProducts, setAllProducts] = useState([]);
     const [filteredProducts, setFilteredProducts] = useState([]);
     const [featuredProducts, setFeaturedProducts] = useState([]);
   ```

2. **Carga inicial de datos:**
   ```jsx
   useEffect(() => {
     const fetchData = async () => {
       dispatch({ type: 'SET_LOADING', payload: true });
       try {
         const products = await productsApi.getProducts();
         const categoriesList = await productsApi.getCategories();
         
         dispatch({ type: 'SET_PRODUCTS', payload: products });
         setAllProducts(products);
         setFilteredProducts(products);
         setFeaturedProducts(productsWithStock.slice(0, 6));
       } catch (error) {
         console.error('Error fetching data:', error);
       } finally {
         dispatch({ type: 'SET_LOADING', payload: false });
       }
     };
     fetchData();
   }, [dispatch]);
   ```

3. **Renderizado condicional:**
   ```jsx
   return (
     <div className="home">
       <BannerCarousel />
       <CategoryFilter 
         categories={categories}
         selectedCategory={selectedCategory}
         onCategoryChange={setSelectedCategory}
       />
       {state.loading ? (
         <div className="loading">Cargando productos...</div>
       ) : (
         <ProductGrid products={filteredProducts} />
       )}
     </div>
   );
   ```

**Hooks utilizados:**
- `useApp()`: Para estado global de productos y loading
- `useState()`: Para productos locales, filtros, categorías seleccionadas
- `useEffect()`: Para carga inicial y filtrado
- `useSearchParams()`: Para sincronizar filtros con URL

**Props utilizadas:**
- `ProductCard`: Recibe `{ product }` como prop principal
- `CategoryFilter`: Recibe `{ categories, selectedCategory, onCategoryChange }`
- `BannerCarousel`: Sin props (datos internos)

**LocalStorage/SessionStorage:**
- No maneja persistencia directa (delegado a contextos)

**Llamadas asíncronas:**
- `productsApi.getProducts()`: Carga inicial de productos desde JSON Server
- `productsApi.getCategories()`: Obtiene lista de categorías únicas
- Fallback automático a `localProductsService` si falla JSON Server

### **2. BÚSQUEDA DE PRODUCTOS (Search.jsx)**

**Componentes involucrados:**
- `Header.jsx` (barra de búsqueda)
- `Search.jsx` (página de resultados)
- `ProductCard.jsx` (resultados individuales)

**Flujo paso a paso:**

1. **Input en Header:**
   ```jsx
   const handleSearch = (e) => {
     e.preventDefault();
     if (searchTerm.trim()) {
       navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
       setSearchTerm('');
     }
   };
   ```

2. **Carga de página Search:**
   ```jsx
   function Search() {
     const [searchParams] = useSearchParams();
     const query = searchParams.get('q');
     const [results, setResults] = useState([]);
     const [loading, setLoading] = useState(false);
   }
   ```

3. **Búsqueda automática:**
   ```jsx
   useEffect(() => {
     const performSearch = async () => {
       if (!query) return;
       
       setLoading(true);
       try {
         const searchResults = await productsApi.searchProducts(query);
         setResults(searchResults);
       } catch (error) {
         console.error('Error searching products:', error);
       } finally {
         setLoading(false);
       }
     };
     performSearch();
   }, [query]);
   ```

**Hooks utilizados:**
- `useSearchParams()`: Para obtener query de la URL
- `useState()`: Para resultados, loading y error
- `useEffect()`: Para ejecutar búsqueda cuando cambia query
- `useNavigate()`: Para navegación desde Header

**React Router:**
- **Ruta**: `/search` con query parameter `?q=termino`
- **Navegación**: `navigate(\`/search?q=${encodeURIComponent(searchTerm)}\`)`
- **Parámetros**: `useSearchParams()` para extraer query

**Llamadas asíncronas:**
- `productsApi.searchProducts(query)`: Búsqueda en JSON Server
- Implementación con filtrado por título, descripción y tags

### **3. FILTRADO POR CATEGORÍA (Category.jsx)**

**Componentes involucrados:**
- `CategoryDropdown.jsx` (selector en header)
- `CategoryFilter.jsx` (filtros en home) 
- `Category.jsx` (página dedicada por categoría)

**Flujo paso a paso:**

1. **Selección de categoría:**
   ```jsx
   // En CategoryDropdown
   const handleCategorySelect = (category) => {
     navigate(`/category/${encodeURIComponent(category)}`);
   };
   ```

2. **Carga de página Category:**
   ```jsx
   function Category() {
     const { category } = useParams();
     const [products, setProducts] = useState([]);
     const [loading, setLoading] = useState(true);
   }
   ```

3. **Filtrado por categoría:**
   ```jsx
   useEffect(() => {
     const fetchCategoryProducts = async () => {
       try {
         const categoryProducts = await productsApi.getProductsByCategory(category);
         setProducts(categoryProducts);
       } catch (error) {
         console.error('Error fetching category products:', error);
       } finally {
         setLoading(false);
       }
     };
     fetchCategoryProducts();
   }, [category]);
   ```

**Hooks utilizados:**
- `useParams()`: Para obtener categoría de la URL
- `useState()`: Para productos filtrados y loading
- `useEffect()`: Para recargar cuando cambia categoría
- `useNavigate()`: Para navegación desde selectores

**React Router:**
- **Ruta**: `/category/:category` con parámetro dinámico
- **Navegación**: `navigate(\`/category/${category}\`)`
- **Parámetros**: `useParams()` para extraer categoría

**Llamadas asíncronas:**
- `productsApi.getProductsByCategory(category)`: Filtrado en JSON Server
- URL formada: `GET /products?category=${category}`

### **4. DETALLE DE PRODUCTO (ProductDetail.jsx)**

**Componentes involucrados:**
- `ProductDetail.jsx` (página principal)
- `FavoriteButton.jsx` (botón de favoritos)

**Flujo paso a paso:**

1. **Navegación al detalle:**
   ```jsx
   // Desde ProductCard
   <Link to={`/producto/${product.id}`}>
     <div className="product-card">
   ```

2. **Carga del producto:**
   ```jsx
   function ProductDetail() {
     const { id } = useParams();
     const [product, setProduct] = useState(null);
     const [loading, setLoading] = useState(true);
     const [selectedImage, setSelectedImage] = useState(0);
     const [quantity, setQuantity] = useState(1);
   }
   ```

3. **Obtención de datos:**
   ```jsx
   useEffect(() => {
     const fetchProduct = async () => {
       try {
         const productData = await productsApi.getProduct(id);
         setProduct(productData);
       } catch (error) {
         console.error('Error fetching product:', error);
       } finally {
         setLoading(false);
       }
     };
     fetchProduct();
   }, [id]);
   ```

4. **Renderizado condicional por propietario:**
   ```jsx
   const { isProductOwner } = useAuth();
   
   return (
     <div className="product-detail">
       {isProductOwner(product.sellerId) ? (
         <button onClick={() => navigate('/vender', { state: { editProduct: product } })}>
           ✏️ Editar mi producto
         </button>
       ) : (
         <div className="purchase-actions">
           <button onClick={handleAddToCart}>Agregar al carrito</button>
           <button onClick={handleBuyNow}>Comprar ahora</button>
         </div>
       )}
     </div>
   );
   ```

**Hooks utilizados:**
- `useParams()`: Para obtener ID del producto de la URL
- `useState()`: Para producto, loading, imagen seleccionada, cantidad
- `useEffect()`: Para cargar producto cuando cambia ID
- `useAuth()`: Para verificar propiedad del producto
- `useCart()`: Para funciones de carrito
- `useNavigate()`: Para navegación a panel de vendedor

**React Router:**
- **Rutas**: `/product/:id` y `/producto/:id` (ambas válidas)
- **Navegación**: Links desde ProductCard
- **Parámetros**: `useParams()` para extraer ID
- **Estado**: `navigate('/vender', { state: { editProduct: product } })` para edición

**Llamadas asíncronas:**
- `productsApi.getProduct(id)`: Obtiene producto específico
- URL formada: `GET /products/${id}`

**Props y children:**
- No recibe props (obtiene datos por ID de URL)
- No usa children (componente de página completa)

### **5. INTEGRACIÓN CON PERFIL DE USUARIO**

**Flujo de verificación de propietario:**

1. **En ProductCard:**
   ```jsx
   const { currentUser, isProductOwner } = useAuth();
   
   // Renderizado condicional de botones
   {isProductOwner(product.sellerId) ? (
     <button onClick={() => navigate('/vender', { state: { editProduct: product } })}>
       Editar
     </button>
   ) : (
     <button onClick={handleAddToCart}>
       Agregar al carrito
     </button>
   )}
   ```

2. **En ProductDetail:**
   ```jsx
   // Verificación de propiedad
   const isOwner = isProductOwner(product.sellerId);
   
   // Botones contextuales
   if (isOwner) {
     // Mostrar botón de editar
   } else if (canPurchaseProduct(product.sellerId)) {
     // Mostrar botones de compra
   }
   ```

3. **Navegación a perfil de vendedor:**
   ```jsx
   <Link to={`/vendedor/${product.sellerId}`}>
     Ver perfil del vendedor
   </Link>
   ```

**Integración con autenticación:**
- `isProductOwner(sellerId)`: Compara `currentUser.id` con `sellerId`
- `canPurchaseProduct(sellerId)`: Previene auto-compra
- Redirección a login si no está autenticado para comprar

**LocalStorage involucrado:**
- `currentUser`: Para verificaciones de propiedad
- `pendingAddToCart`: Para productos pendientes tras login

---

## 🛒 FLUJOS DE TRABAJO DETALLADOS - GESTIÓN DE PRODUCTOS

### **1. MÓDULO DE VENDER (SellerPanel.jsx)**

**Componente principal:**
- `SellerPanel.jsx` (página completa de gestión)

**Flujo paso a paso:**

1. **Acceso y protección:**
   ```jsx
   function SellerPanel() {
     const { currentUser, getSellerInfo } = useAuth();
     const [currentView, setCurrentView] = useState('list'); // 'list' o 'form'
     
     useEffect(() => {
       if (!currentUser) {
         navigate('/login');
         return;
       }
       loadSellerProducts();
     }, [currentUser]);
   }
   ```

2. **Carga de productos del vendedor:**
   ```jsx
   const loadSellerProducts = async () => {
     setLoading(true);
     try {
       const allProducts = await api.getProducts();
       const myProducts = allProducts.filter(product => 
         product.sellerId === currentUser.id
       );
       setProducts(myProducts);
     } catch (error) {
       console.error('Error loading products:', error);
     } finally {
       setLoading(false);
     }
   };
   ```

3. **Navegación interna entre vistas:**
   ```jsx
   // Vista de lista
   const showProductList = () => {
     setCurrentView('list');
     setSelectedProduct(null);
     resetForm();
   };
   
   // Vista de formulario
   const showProductForm = () => {
     setCurrentView('form');
   };
   ```

**Estado interno complejo:**
```jsx
const [products, setProducts] = useState([]);           // Productos del vendedor
const [selectedProduct, setSelectedProduct] = useState(null);  // Para edición
const [currentView, setCurrentView] = useState('list'); // Vista actual
const [formData, setFormData] = useState({             // Formulario
  title: '', price: '', description: '', category: '',
  thumbnail: '', images: [''], stock: '', condition: 'new',
  free_shipping: false, location: '', tags: ''
});
const [loading, setLoading] = useState(false);
const [notification, setNotification] = useState(null);
```

**Hooks utilizados:**
- `useState()`: Para múltiples estados del panel
- `useEffect()`: Para carga inicial y manejo de navegación externa
- `useAuth()`: Para verificar usuario y obtener info de vendedor
- `useNavigate()`: Para redirecciones de seguridad
- `useLocation()`: Para recibir productos a editar desde otras páginas

**React Router:**
- **Ruta protegida**: `/vender` con `ProtectedRoute`
- **Estado en navegación**: Recibe productos para editar via `location.state`
- **Limpieza de estado**: `navigate('/vender', { replace: true, state: {} })`

### **2. PROCESO DE CREACIÓN DE PRODUCTOS**

**Flujo paso a paso:**

1. **Inicialización del formulario:**
   ```jsx
   const resetForm = () => {
     setFormData({
       title: '', price: '', description: '', category: '',
       thumbnail: '', images: [''], stock: '', condition: 'new',
       free_shipping: false, location: '', tags: ''
     });
   };
   
   const handleNewProduct = () => {
     resetForm();
     setSelectedProduct(null);
     setCurrentView('form');
   };
   ```

2. **Manejo de imágenes múltiples:**
   ```jsx
   const handleImageChange = (index, value) => {
     const newImages = [...formData.images];
     newImages[index] = value;
     setFormData({ ...formData, images: newImages });
   };
   
   const addImageField = () => {
     if (formData.images.length < 8) {
       setFormData({ 
         ...formData, 
         images: [...formData.images, ''] 
       });
     }
   };
   ```

3. **Validación y envío:**
   ```jsx
   const handleSubmit = async (e) => {
     e.preventDefault();
     
     // Validaciones
     if (!formData.title || !formData.price || !formData.description) {
       setNotification({ type: 'error', message: 'Campos obligatorios faltantes' });
       return;
     }
     
     try {
       const productData = {
         ...formData,
         price: parseFloat(formData.price),
         stock: parseInt(formData.stock),
         sellerId: currentUser.id,
         seller: {
           nickname: sellerInfo.nickname,
           reputation: sellerInfo.reputation
         },
         images: formData.images.filter(img => img.trim() !== ''),
         tags: formData.tags.split(',').map(tag => tag.trim()),
         id: Date.now().toString(),
         currency: 'ARS'
       };
       
       await api.createProduct(productData);
       setNotification({ type: 'success', message: 'Producto creado exitosamente' });
       loadSellerProducts();
       setCurrentView('list');
     } catch (error) {
       setNotification({ type: 'error', message: 'Error al crear producto' });
     }
   };
   ```

**Validaciones implementadas:**
- Campos obligatorios: título, precio, descripción, categoría
- Límite de imágenes: máximo 8 URLs
- Validación numérica: precio y stock
- Filtrado de imágenes vacías
- Tags separados por comas

### **3. PROCESO DE EDICIÓN DE PRODUCTOS**

**Flujo desde ProductDetail:**

1. **Navegación con estado:**
   ```jsx
   // En ProductDetail.jsx
   const handleEditProduct = () => {
     navigate('/vender', { state: { editProduct: product } });
   };
   ```

2. **Recepción en SellerPanel:**
   ```jsx
   useEffect(() => {
     if (location.state?.editProduct) {
       const productToEdit = location.state.editProduct;
       setSelectedProduct(productToEdit);
       setCurrentView('form');
       
       // Pre-llenar formulario
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
       
       // Limpiar estado de navegación
       setTimeout(() => {
         navigate('/vender', { replace: true, state: {} });
       }, 100);
     }
   }, [location.state?.editProduct]);
   ```

3. **Actualización del producto:**
   ```jsx
   const updateProduct = async () => {
     try {
       const updatedData = {
         ...formData,
         price: parseFloat(formData.price),
         stock: parseInt(formData.stock),
         images: formData.images.filter(img => img.trim() !== ''),
         tags: formData.tags.split(',').map(tag => tag.trim())
       };
       
       await api.updateProduct(selectedProduct.id, updatedData);
       setNotification({ type: 'success', message: 'Producto actualizado' });
       loadSellerProducts();
       setCurrentView('list');
     } catch (error) {
       setNotification({ type: 'error', message: 'Error al actualizar' });
     }
   };
   ```

### **4. PROCESO DE ELIMINACIÓN**

**Flujo paso a paso:**

1. **Confirmación del usuario:**
   ```jsx
   const handleDeleteProduct = async (productId) => {
     if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
       try {
         await api.deleteProduct(productId);
         setNotification({ type: 'success', message: 'Producto eliminado' });
         loadSellerProducts(); // Recargar lista
       } catch (error) {
         setNotification({ type: 'error', message: 'Error al eliminar producto' });
       }
     }
   };
   ```

**Llamadas asíncronas:**
- `api.createProduct(data)`: POST a `/products`
- `api.updateProduct(id, data)`: PATCH a `/products/${id}`
- `api.deleteProduct(id)`: DELETE a `/products/${id}`
- `api.getProducts()`: GET para cargar productos del vendedor

### **5. INTEGRACIÓN CON PERFIL DE USUARIO**

**Información del vendedor:**
```jsx
const { getSellerInfo } = useAuth();
const [sellerInfo, setSellerInfo] = useState(null);

useEffect(() => {
  const currentSellerInfo = getSellerInfo();
  setSellerInfo(currentSellerInfo);
}, [currentUser]);

// Usar en productos
const productData = {
  ...formData,
  sellerId: currentUser.id,
  seller: {
    nickname: sellerInfo.nickname,
    reputation: sellerInfo.reputation
  }
};
```

**Verificaciones de seguridad:**
- Solo productos del usuario actual pueden editarse
- Filtrado por `sellerId` en la carga de productos
- Redirección a login si no está autenticado

---

## 👥 FLUJOS DE TRABAJO DETALLADOS - USUARIOS

### **1. REGISTRO DE USUARIOS (Register.jsx)**

**Componente principal:**
- `Register.jsx`

**Flujo paso a paso:**

1. **Formulario de registro:**
   ```jsx
   function Register() {
     const { register } = useAuth();
     const navigate = useNavigate();
     
     const {
       formData, error, loading, handleChange, handleSubmit
     } = useForm({ 
       firstName: '', lastName: '', email: '', password: '' 
     }, async (data) => {
       try {
         await register(data);
         navigate('/');
       } catch (error) {
         throw error;
       }
     });
   }
   ```

2. **Proceso en AuthContext:**
   ```jsx
   const register = async (userData) => {
     try {
       // Verificar email único
       const response = await fetch('http://localhost:3000/users');
       const users = await response.json();
       
       if (users.some(user => user.email === userData.email)) {
         throw new Error('El email ya está registrado');
       }
       
       // Crear usuario con perfil de vendedor automático
       const newUserData = {
         ...userData,
         id: (users.length + 1).toString(),
         role: 'user',
         avatar: 'https://via.placeholder.com/150',
         sellerProfile: {
           nickname: `${userData.firstName}_STORE`.toUpperCase(),
           reputation: 'bronze',
           description: `Tienda de ${userData.firstName} ${userData.lastName}`,
           location: 'Argentina',
           phone: '+54 11 0000-0000'
         },
         createdAt: new Date().toISOString()
       };
       
       const saveUser = await fetch('http://localhost:3000/users', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(newUserData)
       });
       
       const newUser = await saveUser.json();
       setCurrentUser(newUser); // Login automático
       return newUser;
     } catch (error) {
       setError(error.message);
       throw error;
     }
   };
   ```

**Hooks utilizados:**
- `useForm()`: Para manejo del formulario de registro
- `useAuth()`: Para función de registro
- `useNavigate()`: Para redirección tras registro exitoso

**Datos auto-generados:**
- ID único basado en cantidad de usuarios
- Perfil de vendedor con nickname automático
- Avatar placeholder
- Reputación inicial en 'bronze'
- Fecha de creación

**Llamadas asíncronas:**
- `GET /users`: Para verificar email único
- `POST /users`: Para crear nuevo usuario

### **2. LOGIN DE USUARIOS (Login.jsx)**

**Componente principal:**
- `Login.jsx`

**Flujo paso a paso:**

1. **Formulario de login:**
   ```jsx
   function Login() {
     const { login } = useAuth();
     const navigate = useNavigate();
     const location = useLocation();
     const [showModal, setShowModal] = useState(false);
     
     const { formData, handleChange, handleSubmit } = useForm(
       { email: '', password: '' }, 
       async (data) => {
         try {
           await login(data.email, data.password);
           
           // Procesar productos pendientes
           const pendingProduct = sessionStorage.getItem('pendingAddToCart');
           if (pendingProduct) {
             // Lógica para agregar producto tras login
             sessionStorage.removeItem('pendingAddToCart');
           }
           
           // Navegar a destino original o home
           const from = location.state?.from?.pathname || '/';
           navigate(from);
         } catch (error) {
           throw error;
         }
       }
     );
   }
   ```

2. **Proceso en AuthContext:**
   ```jsx
   const login = async (email, password) => {
     try {
       const response = await fetch(`http://localhost:3000/users?email=${email}`);
       const users = await response.json();
       
       const user = users.find(u => u.password === password);
       if (user) {
         setCurrentUser(user);
         setError('');
         return user;
       } else {
         throw new Error('Credenciales inválidas');
       }
     } catch (error) {
       setError(error.message);
       throw error;
     }
   };
   ```

**Hooks utilizados:**
- `useForm()`: Para manejo del formulario de login
- `useAuth()`: Para función de autenticación
- `useNavigate()`: Para redirección tras login
- `useLocation()`: Para preservar destino original
- `useState()`: Para modal de mensajes

**Manejo de intenciones pendientes:**
- `sessionStorage.getItem('pendingAddToCart')`: Producto a agregar tras login
- Procesamiento automático de productos pendientes
- Limpieza de sessionStorage tras procesar

**Redirección inteligente:**
- `location.state?.from?.pathname`: Destino original preservado
- Fallback a home (`/`) si no hay destino específico

**Llamadas asíncronas:**
- `GET /users?email=${email}`: Para buscar usuario por email
- Autenticación por comparación de password (sin encriptación)

---

## 🛒 FLUJOS DE TRABAJO DETALLADOS - CARRITO

### **1. INTEGRACIÓN CON USUARIOS**

**Estrategia de persistencia multi-usuario:**

```jsx
// En AppContext.jsx
const getCartKey = () => {
  return currentUser ? `mercadolibre-cart-${currentUser.id}` : 'mercadolibre-cart-guest';
};

const saveCart = useCallback((cartItems) => {
  const cartKey = getCartKey();
  localStorage.setItem(cartKey, JSON.stringify(cartItems));
}, [currentUser]);

const loadCart = useCallback(() => {
  const cartKey = getCartKey();
  const savedCart = localStorage.getItem(cartKey);
  return savedCart ? JSON.parse(savedCart) : [];
}, [currentUser]);
```

**Merge automático de carritos:**

```jsx
useEffect(() => {
  if (currentUser) {
    // Usuario se loguea: combinar carrito guest + usuario
    const guestCart = JSON.parse(localStorage.getItem('mercadolibre-cart-guest') || '[]');
    const userCart = loadCart();
    
    if (guestCart.length > 0) {
      // Merge lógico: sumar cantidades de productos iguales
      const mergedCart = [...userCart];
      
      guestCart.forEach(guestItem => {
        const existingItem = mergedCart.find(item => item.id === guestItem.id);
        if (existingItem) {
          existingItem.quantity = Math.min(
            existingItem.quantity + guestItem.quantity,
            guestItem.stock
          );
        } else {
          mergedCart.push(guestItem);
        }
      });
      
      dispatch({ type: 'LOAD_CART', payload: mergedCart });
      saveCart(mergedCart);
      
      // Limpiar carrito guest
      localStorage.removeItem('mercadolibre-cart-guest');
    }
  }
}, [currentUser]);
```

### **2. FUNCIONALIDAD DEL CARRITO (Cart.jsx)**

**Componente principal:**
- `Cart.jsx`

**Flujo paso a paso:**

1. **Carga inicial del carrito:**
   ```jsx
   function Cart() {
     const { 
       getSubtotal, getShippingCost, getTotal, getTotalItems,
       updateQuantity, removeFromCart, clearCart, formatPrice
     } = useCart();
     const { state } = useApp();
     const { currentUser } = useAuth();
   }
   ```

2. **Gestión de cantidades:**
   ```jsx
   const handleQuantityChange = (productId, newQuantity, maxStock) => {
     if (newQuantity < 1 || newQuantity > maxStock) return;
     updateQuantity(productId, newQuantity);
   };
   
   const incrementQuantity = (productId, currentQuantity, maxStock) => {
     if (currentQuantity < maxStock) {
       updateQuantity(productId, currentQuantity + 1);
     }
   };
   
   const decrementQuantity = (productId, currentQuantity) => {
     if (currentQuantity > 1) {
       updateQuantity(productId, currentQuantity - 1);
     }
   };
   ```

3. **Cálculos automáticos:**
   ```jsx
   // En useCart.js
   const getSubtotal = () => {
     return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
   };
   
   const getShippingCost = () => {
     const hasNonFreeShipping = state.cart.some(item => !item.free_shipping);
     return hasNonFreeShipping ? 1500 : 0;
   };
   
   const getTotal = () => {
     return getSubtotal() + getShippingCost();
   };
   ```

**Hooks utilizados:**
- `useCart()`: Para toda la lógica del carrito
- `useApp()`: Para acceso al estado global
- `useAuth()`: Para verificar usuario y permisos
- `useEffect()`: Para cargar carrito inicial

**Validaciones implementadas:**
- **Stock disponible**: No exceder cantidad disponible
- **Cantidad mínima**: No menos de 1 por producto
- **Propietario**: No comprar productos propios
- **Autenticación**: Requerir login para acceder al carrito

**Props utilizadas:**
- Cart.jsx no recibe props (página completa)
- Usa hooks para obtener datos del estado global

**Rutas protegidas:**
- `/cart` y `/carrito`: Ambas requieren `ProtectedRoute`
- Redirección automática a login si no está autenticado

### **3. ACCIONES DEL CARRITO EN useCart.js**

**Métodos principales:**

```jsx
const addToCart = (product, quantity = 1) => {
  if (!canAddToCart(product)) return;
  
  dispatch({ 
    type: 'ADD_TO_CART', 
    payload: { ...product, quantity } 
  });
};

const updateQuantity = (productId, newQuantity) => {
  dispatch({ 
    type: 'UPDATE_CART_QUANTITY', 
    payload: { productId, quantity: newQuantity } 
  });
};

const removeFromCart = (productId) => {
  dispatch({ 
    type: 'REMOVE_FROM_CART', 
    payload: productId 
  });
};

const clearCart = () => {
  dispatch({ type: 'CLEAR_CART' });
};

const canAddToCart = (product) => {
  if (!product || product.stock <= 0) return false;
  
  const currentQuantity = getItemQuantity(product.id);
  return currentQuantity < product.stock;
};
```

**LocalStorage automático:**
- Guardado tras cada acción de carrito
- Carga automática al cambiar usuario
- Limpieza de carritos obsoletos

---

## ⭐ FLUJOS DE TRABAJO DETALLADOS - FAVORITOS

### **1. FUNCIONALIDAD DE FAVORITOS (FavoritesContext.jsx)**

**Estado gestionado:**
```jsx
const initialState = {
  items: [],       // Lista de productos favoritos completos
  loading: false   // Estado de carga
};

function favoritesReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOAD_FAVORITES':
      return { ...state, items: action.payload };
    case 'ADD_FAVORITE':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_FAVORITE':
      return { 
        ...state, 
        items: state.items.filter(item => item.id !== action.payload) 
      };
    default:
      return state;
  }
}
```

**Métodos principales:**
```jsx
const addToFavorites = (product) => {
  if (!currentUser) return;
  
  const isAlreadyFavorite = state.items.some(item => item.id === product.id);
  if (!isAlreadyFavorite) {
    dispatch({ type: 'ADD_FAVORITE', payload: product });
  }
};

const removeFromFavorites = (productId) => {
  dispatch({ type: 'REMOVE_FAVORITE', payload: productId });
};

const toggleFavorite = (product) => {
  if (isFavorite(product.id)) {
    removeFromFavorites(product.id);
  } else {
    addToFavorites(product);
  }
};

const isFavorite = (productId) => {
  return state.items.some(item => item.id === productId);
};

const getFavoritesCount = () => {
  return state.items.length;
};
```

### **2. INTEGRACIÓN CON USUARIOS**

**Persistencia por usuario:**
```jsx
// Cargar favoritos del usuario al cambiar
useEffect(() => {
  if (currentUser) {
    const savedFavorites = localStorage.getItem(`favorites_${currentUser.id}`);
    if (savedFavorites) {
      dispatch({ type: 'LOAD_FAVORITES', payload: JSON.parse(savedFavorites) });
    }
  } else {
    dispatch({ type: 'LOAD_FAVORITES', payload: [] });
  }
}, [currentUser]);

// Guardar automáticamente cuando cambian favoritos
useEffect(() => {
  if (currentUser && state.items.length >= 0) {
    localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(state.items));
  }
}, [state.items, currentUser]);
```

**Verificación de autenticación:**
```jsx
// En FavoriteButton.jsx
function FavoriteButton({ product, size = 'medium', className = '' }) {
  const { currentUser } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      // Redirigir a login si no está autenticado
      navigate('/login');
      return;
    }
    
    toggleFavorite(product);
  };
  
  if (!currentUser) {
    return null; // No mostrar botón si no está logueado
  }
}
```

### **3. PÁGINA DE FAVORITOS (Favorites.jsx)**

**Flujo paso a paso:**

1. **Carga de favoritos:**
   ```jsx
   function Favorites() {
     const { state } = useFavorites();
     const { currentUser } = useAuth();
     
     if (!currentUser) {
       return <div>Debes iniciar sesión para ver tus favoritos</div>;
     }
   }
   ```

2. **Renderizado de productos favoritos:**
   ```jsx
   return (
     <div className="favorites-page">
       <h1>Mis Favoritos ({state.items.length})</h1>
       {state.loading ? (
         <div className="loading">Cargando favoritos...</div>
       ) : state.items.length > 0 ? (
         <div className="favorites-grid">
           {state.items.map(product => (
             <ProductCard key={product.id} product={product} />
           ))}
         </div>
       ) : (
         <div className="empty-favorites">
           <p>No tienes productos favoritos aún</p>
           <Link to="/">Explorar productos</Link>
         </div>
       )}
     </div>
   );
   ```

**Hooks utilizados:**
- `useFavorites()`: Para estado y acciones de favoritos
- `useAuth()`: Para verificar autenticación
- No requiere `useState` local (todo desde contexto)

**Características:**
- **Solo usuarios autenticados**: Verificación de `currentUser`
- **Persistencia automática**: localStorage por usuario
- **Contador en header**: `getFavoritesCount()` para mostrar cantidad
- **Toggle intuitivo**: Un click agrega/quita de favoritos

**LocalStorage utilizado:**
- `favorites_{userId}`: Favoritos específicos por usuario
- Carga/guardado automático al cambiar usuario
- Limpieza al logout (array vacío)

**Integración con ProductCard:**
- FavoriteButton aparece en cada ProductCard
- Estado sincronizado entre todos los componentes
- Feedback visual inmediato al cambiar estado

---

## 📱 COMPONENTES POR FUNCIONALIDAD

### **Header.jsx**
**Propósito:** Navegación principal, búsqueda y estado global de usuario

**Props:** No recibe props (obtiene todo desde contextos)

**Children:** No usa children

**Estado interno:**
```jsx
const [searchTerm, setSearchTerm] = useState('');
const [isSearchOpen, setIsSearchOpen] = useState(false);
const [isMenuOpen, setIsMenuOpen] = useState(false);
```

**Hooks utilizados:**
- `useAuth()`: Para currentUser, logout y verificaciones
- `useCart()`: Para getTotalItems() - contador del carrito
- `useFavorites()`: Para getFavoritesCount() - contador de favoritos
- `useNavigate()`: Para navegación programática
- `useState()`: Para estado local de búsqueda y menús
- `useEffect()`: Para cerrar menús al hacer click fuera

**Funcionalidades principales:**
- **Barra de búsqueda**: Navegación a `/search?q=termino`
- **Menú de usuario**: Login/logout, perfil, panel de vendedor
- **Contadores**: Items en carrito y favoritos
- **Responsive**: Menú hamburguesa en móvil

### **ProductCard.jsx** 
**Propósito:** Tarjeta reutilizable de producto con acciones contextuales

**Props:**
```jsx
ProductCard.propTypes = {
  product: PropTypes.object.isRequired
}
```

**Children:** No usa children

**Estado interno:** Solo hooks (sin useState local)

**Hooks utilizados:**
- `useCart()`: Para addToCart, canAddToCart, formatPrice
- `useAuth()`: Para currentUser, isProductOwner, canPurchaseProduct
- `useNavigate()`: Para redirecciones (login, edición)
- `useLocation()`: Para preservar ubicación en redirecciones

**Renderizado condicional:**
```jsx
// Si es propietario del producto
{isProductOwner(product.sellerId) ? (
  <button onClick={() => navigate('/vender', { state: { editProduct: product } })}>
    ✏️ Editar
  </button>
) : (
  <div className="product-actions">
    <FavoriteButton product={product} />
    <button onClick={handleAddToCart}>
      🛒 Agregar
    </button>
  </div>
)}
```

**Manejo de eventos:**
- `handleAddToCart`: Verifica auth, stock y añade al carrito
- `handleBuyNow`: Agrega y navega al carrito
- **SessionStorage**: Guarda intención si no está logueado

### **ProductGrid.jsx**
**Propósito:** Contenedor responsivo para múltiples ProductCard

**Props:**
```jsx
ProductGrid.propTypes = {
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string
}
```

**Children:** Genera ProductCard components dinámicamente

**Hooks utilizados:** Ninguno (componente presentacional puro)

**Renderizado:**
```jsx
function ProductGrid({ products, loading, error }) {
  if (loading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">{error}</div>;
  if (products.length === 0) return <div className="empty">No hay productos</div>;
  
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### **FavoriteButton.jsx**
**Propósito:** Botón de favoritos reutilizable con estado sincronizado

**Props:**
```jsx
FavoriteButton.propTypes = {
  product: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string
}
```

**Children:** No usa children

**Estado interno:** Solo hooks (estado desde contexto)

**Hooks utilizados:**
- `useFavorites()`: Para isFavorite, toggleFavorite
- `useAuth()`: Para verificar currentUser
- `useNavigate()`: Para redirección a login si necesario

**Comportamiento:**
- **Solo usuarios logueados**: Se oculta si no hay currentUser
- **Toggle instantáneo**: Cambia estado inmediatamente
- **Persistencia automática**: Guarda en localStorage por contexto

### **ProtectedRoute.jsx**
**Propósito:** HOC para proteger rutas que requieren autenticación

**Props:**
```jsx
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
}
```

**Children:** Renderiza children solo si hay usuario autenticado

**Hooks utilizados:**
- `useAuth()`: Para verificar currentUser
- `useNavigate()`: Para redirección a login
- `useLocation()`: Para preservar destino de retorno
- `useEffect()`: Para verificación automática

**Lógica de protección:**
```jsx
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) {
      // Preservar destino para retorno tras login
      navigate('/login', { state: { from: location } });
    }
  }, [currentUser, navigate, location]);

  return currentUser ? children : null;
}
```

### **CategoryDropdown.jsx**
**Propósito:** Selector desplegable de categorías en el header

**Props:** No recibe props (maneja estado interno)

**Children:** Options generados dinámicamente

**Estado interno:**
```jsx
const [isOpen, setIsOpen] = useState(false);
const [categories, setCategories] = useState([]);
```

**Hooks utilizados:**
- `useState()`: Para estado del dropdown y categorías
- `useEffect()`: Para cargar categorías desde API
- `useNavigate()`: Para navegación a páginas de categoría

**Funcionalidad:**
- Carga categorías dinámicamente de la API
- Navegación a `/category/${categoryName}`
- Cierre automático tras selección

### **CategoryFilter.jsx**
**Propósito:** Filtros de categoría en la página de inicio

**Props:**
```jsx
CategoryFilter.propTypes = {
  categories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func.isRequired
}
```

**Children:** No usa children

**Hooks utilizados:** Ninguno (componente controlado por props)

**Comportamiento:**
- **Componente controlado**: Estado manejado por componente padre
- **Callback pattern**: `onCategoryChange` notifica cambios al padre
- **Filtrado local**: No hace llamadas a API (filtra productos existentes)

---

## 💾 MANEJO DE ESTADO LOCAL

### **LocalStorage - Estrategia de Persistencia**

**1. Autenticación:**
```javascript
// Clave: 'currentUser'
// Valor: Objeto completo del usuario
localStorage.setItem('currentUser', JSON.stringify(user));
const savedUser = JSON.parse(localStorage.getItem('currentUser'));
```

**2. Carrito por Usuario:**
```javascript
// Usuarios autenticados
const cartKey = `mercadolibre-cart-${userId}`;
localStorage.setItem(cartKey, JSON.stringify(cartItems));

// Usuarios invitados
localStorage.setItem('mercadolibre-cart-guest', JSON.stringify(cartItems));
```

**3. Favoritos por Usuario:**
```javascript
// Clave: 'favorites_{userId}'
// Valor: Array de productos favoritos completos
localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
```

**4. Historial de Búsquedas (si implementado):**
```javascript
// Clave: 'searchHistory_{userId}'
// Valor: Array de términos de búsqueda recientes
localStorage.setItem(`searchHistory_${userId}`, JSON.stringify(history));
```

### **SessionStorage - Estado Temporal**

**1. Intenciones Pendientes:**
```javascript
// Producto a agregar tras login
sessionStorage.setItem('pendingAddToCart', JSON.stringify({ productId: 'abc123' }));

// Procesamiento tras login
const pending = JSON.parse(sessionStorage.getItem('pendingAddToCart'));
if (pending) {
  // Procesar intención
  sessionStorage.removeItem('pendingAddToCart');
}
```

### **Estado en Memoria - useState por Componente**

**Home.jsx:**
```jsx
const [allProducts, setAllProducts] = useState([]);      // Productos originales
const [filteredProducts, setFilteredProducts] = useState([]); // Productos filtrados
const [featuredProducts, setFeaturedProducts] = useState([]); // Productos destacados
const [categories, setCategories] = useState([]);        // Lista de categorías
const [selectedCategory, setSelectedCategory] = useState(''); // Categoría activa
const [sortBy, setSortBy] = useState('name-asc');       // Ordenamiento
```

**ProductDetail.jsx:**
```jsx
const [product, setProduct] = useState(null);           // Producto actual
const [loading, setLoading] = useState(true);           // Estado de carga
const [selectedImage, setSelectedImage] = useState(0);  // Imagen seleccionada
const [quantity, setQuantity] = useState(1);            // Cantidad a comprar
const [isZoomed, setIsZoomed] = useState(false);       // Zoom de imagen
```

**SellerPanel.jsx:**
```jsx
const [products, setProducts] = useState([]);           // Productos del vendedor
const [selectedProduct, setSelectedProduct] = useState(null); // Para edición
const [currentView, setCurrentView] = useState('list'); // Vista actual
const [formData, setFormData] = useState({...});       // Datos del formulario
const [loading, setLoading] = useState(false);          // Estado de carga
const [notification, setNotification] = useState(null); // Mensajes al usuario
```

**Search.jsx:**
```jsx
const [searchResults, setSearchResults] = useState([]); // Resultados de búsqueda
const [loading, setLoading] = useState(false);          // Estado de carga
const [error, setError] = useState(null);              // Errores de búsqueda
const [noResults, setNoResults] = useState(false);     // Sin resultados flag
```

### **Sincronización y Limpieza Automática**

**1. Limpieza al logout:**
```jsx
const logout = () => {
  setCurrentUser(null);
  localStorage.removeItem('currentUser');
  // Los contextos detectan cambio y limpian datos específicos del usuario
};
```

**2. Merge de datos al login:**
```jsx
useEffect(() => {
  if (currentUser) {
    // Combinar carrito guest con carrito de usuario
    mergeGuestCart();
    // Cargar favoritos del usuario
    loadUserFavorites();
  } else {
    // Limpiar datos sensibles
    clearUserSpecificData();
  }
}, [currentUser]);
```

**3. Persistencia automática en contextos:**
```jsx
// Los contextos guardan automáticamente tras cada cambio
useEffect(() => {
  if (currentUser && state.items.length >= 0) {
    localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(state.items));
  }
}, [state.items, currentUser]);
```

### **Estrategias de Optimización**

**1. Debounce para búsquedas:**
```jsx
useEffect(() => {
  const timeoutId = setTimeout(() => {
    if (searchTerm.length > 2) {
      performSearch(searchTerm);
    }
  }, 300);
  
  return () => clearTimeout(timeoutId);
}, [searchTerm]);
```

**2. Memoización de cálculos pesados:**
```jsx
const expensiveCalculation = useMemo(() => {
  return products.filter(p => p.category === selectedCategory)
                 .sort((a, b) => a.price - b.price);
}, [products, selectedCategory]);
```

**3. Lazy loading de componentes:**
```jsx
const LazyProductDetail = lazy(() => import('./pages/ProductDetail'));

// En routes
<Route path="/producto/:id" element={
  <Suspense fallback={<div>Cargando...</div>}>
    <LazyProductDetail />
  </Suspense>
} />
```

---

## 📋 RESUMEN DE ARQUITECTURA

### **Patrón de Diseño Implementado:**

**1. Flux/Redux-like con React Context:**
- **Contextos globales**: AuthContext, AppContext, FavoritesContext
- **useReducer**: Para estado complejo (carrito, favoritos)
- **Actions**: Acciones tipadas para modificar estado
- **Immutability**: Spread operators para actualizaciones inmutables

**2. Container/Presentational Pattern:**
- **Container Components**: Home, ProductDetail, SellerPanel (lógica)
- **Presentational Components**: ProductCard, ProductGrid, FavoriteButton (UI)
- **Custom Hooks**: useCart, useForm (lógica reutilizable)

**3. Compound Component Pattern:**
- **Provider Hierarchy**: AuthProvider > FavoritesProvider > AppProvider
- **Dependency Injection**: Contextos dependen unos de otros
- **Single Source of Truth**: Cada tipo de dato tiene un contexto responsable

### **Gestión de Estado por Capa:**

**1. Estado Global (React Context):**
- **Autenticación**: Usuario actual, sesiones
- **Carrito**: Items, cantidades, cálculos
- **Favoritos**: Productos marcados como favoritos
- **Productos**: Lista global, resultados de búsqueda

**2. Estado Local (useState):**
- **UI State**: Modals, dropdowns, formularios
- **Derived State**: Filtros, ordenamiento, estado de carga
- **Temporal State**: Selections, navegación temporal

**3. Estado Persistente (localStorage):**
- **Critical Data**: Usuario, carrito, favoritos
- **User Preferences**: Configuraciones, historial
- **Cache**: Datos frecuentemente accedidos

**4. Estado Temporal (sessionStorage):**
- **Navigation State**: Destinos de retorno, intenciones pendientes
- **Workflow State**: Procesos multi-paso, wizards

### **Comunicación con API:**

**1. Service Layer Pattern:**
- **api.js**: Interfaz principal con JSON Server
- **localProductsService.js**: Fallback service
- **Abstraction**: Componentes no conocen la implementación

**2. Error Handling Strategy:**
- **Graceful Degradation**: Fallback automático
- **User Feedback**: Mensajes de error claros
- **Retry Logic**: Reintentos automáticos

**3. Async Patterns:**
- **Async/Await**: Patrón principal para promesas
- **Loading States**: UI responsive durante operaciones
- **Error Boundaries**: Captura de errores inesperados

### **Navegación y Routing:**

**1. Declarative Routing (React Router v7):**
- **Route Configuration**: Centralized en App.jsx
- **Dynamic Routing**: Parámetros y query strings
- **Protected Routes**: HOC pattern para autenticación

**2. Navigation Patterns:**
- **Programmatic Navigation**: useNavigate para flujos complejos
- **State Preservation**: Pasar datos entre rutas
- **Deep Linking**: URLs reflejan estado de aplicación

**3. UX Patterns:**
- **Breadcrumbs**: Navegación contextual
- **Back Button**: Preservar historial del usuario
- **Redirect Logic**: Flujos de autenticación intuitivos

### **Performance Optimizations:**

**1. Code Splitting:**
- **Route-based**: Lazy loading de páginas
- **Component-based**: Componentes grandes bajo demanda
- **Bundle Analysis**: Optimización de tamaños

**2. Memoization:**
- **React.memo**: Prevenir re-renders innecesarios
- **useMemo**: Cálculos pesados
- **useCallback**: Funciones estables

**3. Data Fetching:**
- **Cache Strategy**: localStorage como cache
- **Optimistic Updates**: UI inmediata, sincronización diferida
- **Debouncing**: Limitar frecuencia de API calls

Esta arquitectura proporciona una base sólida, escalable y mantenible para un e-commerce completo, siguiendo las mejores prácticas de React y patrones de diseño probados en la industria.

---

## 🛠️ TECNOLOGÍAS Y DEPENDENCIAS

### **Dependencias principales:**
- **React 19.1.1**: Framework de UI
- **React Router DOM 7.8.2**: Enrutamiento
- **JSON Server 1.0.0-beta.3**: API REST simulada

### **Herramientas de desarrollo:**
- **Vite 7.1.2**: Build tool y dev server
- **ESLint**: Linting de código

### **Scripts disponibles:**
```bash
npm run dev     # Servidor de desarrollo
npm run build   # Build para producción
npm run server  # JSON Server en puerto 3000
npm run lint    # Linting del código
```

---

## 🗃️ JSON SERVER Y BASE DE DATOS

### **Estructura de db.json:**
```json
{
  "products": [...],  # Lista de productos
  "users": [...],     # Usuarios registrados
  "cart": [...]       # Items del carrito (global)
}
```

### **Estructura de Producto:**
```json
{
  "id": "string",
  "title": "string",
  "price": number,
  "currency": "ARS",
  "condition": "new|used|refurbished",
  "free_shipping": boolean,
  "installments": {
    "quantity": number,
    "amount": number
  },
  "thumbnail": "string (URL)",
  "images": ["array de URLs"],
  "category": "string",
  "sellerId": "string",
  "seller": {
    "nickname": "string",
    "reputation": "bronze|silver|gold"
  },
  "location": "string",
  "description": "string",
  "stock": number,
  "tags": ["array de strings"]
}
```

### **Estructura de Usuario:**
```json
{
  "id": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "user",
  "avatar": "string (URL)",
  "sellerProfile": {
    "nickname": "string",
    "reputation": "bronze|silver|gold",
    "description": "string",
    "location": "string",
    "phone": "string"
  },
  "createdAt": "ISO string"
}
```

---

## 🌐 CONTEXTOS Y ESTADO GLOBAL

### **1. AuthContext.jsx**
**Propósito**: Manejo de autenticación y sesiones de usuario

**Estado gestionado:**
- `currentUser`: Usuario actual logueado
- `error`: Errores de autenticación

**Métodos principales:**
- `register(userData)`: Registra nuevo usuario
- `login(email, password)`: Inicia sesión
- `logout()`: Cierra sesión
- `isProductOwner(sellerId)`: Verifica si el usuario es dueño de un producto
- `canPurchaseProduct(sellerId)`: Verifica si puede comprar un producto
- `getSellerInfo()`: Obtiene info del perfil de vendedor

**LocalStorage usado:**
- `currentUser`: Persistencia de sesión

**Hooks utilizados:**
- `useState`: Para currentUser y error
- `useEffect`: Para cargar/guardar usuario en localStorage
- `useContext`: Para consumir el contexto

### **2. AppContext.jsx**
**Propósito**: Estado de aplicación, carrito y búsquedas

**Estado gestionado con useReducer:**
```javascript
{
  cart: [],          // Items del carrito
  products: [],      // Lista de productos
  loading: false,    // Estado de carga
  searchQuery: '',   // Consulta de búsqueda
  searchResults: []  // Resultados de búsqueda
}
```

**Acciones del Reducer:**
- `SET_LOADING`: Controla estado de carga
- `SET_PRODUCTS`: Establece lista de productos
- `ADD_TO_CART`: Agrega item al carrito (con validación de stock)
- `REMOVE_FROM_CART`: Elimina item del carrito
- `UPDATE_CART_QUANTITY`: Actualiza cantidad
- `CLEAR_CART`: Limpia carrito
- `SET_SEARCH_QUERY`: Establece búsqueda
- `SET_SEARCH_RESULTS`: Establece resultados
- `LOAD_CART`: Carga carrito desde localStorage

**LocalStorage usado:**
- `mercadolibre-cart-guest`: Carrito para usuarios no logueados
- `mercadolibre-cart-{userId}`: Carrito por usuario
- Merge automático cuando usuario se loguea

**SessionStorage usado:**
- `pendingAddToCart`: Producto pendiente de agregar tras login

### **3. FavoritesContext.jsx**
**Propósito**: Gestión de productos favoritos

**Estado gestionado con useReducer:**
```javascript
{
  items: [],       // Lista de favoritos
  loading: false   // Estado de carga
}
```

**Métodos principales:**
- `addToFavorites(product)`: Agrega a favoritos
- `removeFromFavorites(productId)`: Elimina de favoritos
- `isFavorite(productId)`: Verifica si es favorito
- `toggleFavorite(product)`: Alterna estado de favorito
- `getFavoritesCount()`: Cuenta total de favoritos

**LocalStorage usado:**
- `favorites_{userId}`: Favoritos por usuario

---

## 🎣 HOOKS PERSONALIZADOS

### **1. useCart.js**
**Propósito**: Abstrae la lógica del carrito

**Métodos retornados:**
- `addToCart(product, quantity)`: Agrega productos
- `removeFromCart(productId)`: Elimina producto
- `updateQuantity(productId, newQuantity)`: Actualiza cantidad
- `clearCart()`: Limpia carrito
- `getItemQuantity(productId)`: Cantidad de un producto
- `canAddToCart(product)`: Verifica si se puede agregar
- `getAvailableStock(product)`: Stock disponible
- `getSubtotal()`: Subtotal del carrito
- `getShippingCost()`: Costo de envío
- `getTotal()`: Total con envío
- `getTotalItems()`: Total de items
- `formatPrice(price)`: Formatea precios en ARS

### **2. useForm.js**
**Propósito**: Manejo genérico de formularios

**Parámetros:**
- `initialValues`: Estado inicial del formulario
- `onSubmit`: Función de envío

**Retorna:**
- `formData`: Datos del formulario
- `setFormData`: Setter manual
- `error`: Error del formulario
- `setError`: Setter de error
- `loading`: Estado de carga
- `handleChange`: Maneja cambios en inputs
- `handleSubmit`: Maneja envío del formulario

---

## 🔌 SERVICIOS Y API

### **api.js**
**Configuración:**
- URL base: `http://localhost:3000`
- Fallback a `localProductsService` si JSON Server falla

**Métodos para productos:**
- `getProducts()`: Lista todos los productos
- `getProduct(id)`: Obtiene producto por ID
- `getProductsByCategory(category)`: Filtra por categoría
- `getCategories()`: Lista categorías únicas
- `searchProducts(query)`: Búsqueda de productos
- `createProduct(data)`: Crea nuevo producto
- `updateProduct(id, data)`: Actualiza producto
- `deleteProduct(id)`: Elimina producto

**Métodos para usuarios:**
- `getUsers()`: Lista usuarios
- `createUser(userData)`: Registra usuario
- `loginUser(email, password)`: Login

**Métodos para carrito:**
- `getCart()`: Obtiene carrito global
- `addToCart(product)`: Agrega al carrito global
- `removeFromCart(id)`: Elimina del carrito global
- `updateCartItem(id, data)`: Actualiza item
- `clearCart()`: Limpia carrito global

**Promesas y Async/Await:**
- Todas las funciones son async
- Manejo de errores con try/catch
- Fallback automático a servicio local

---

## 🚀 FLUJOS DE TRABAJO DETALLADOS

### **1. PRODUCTOS - PANTALLA DE INICIO**

**Componentes involucrados:**
- `Home.jsx` (página principal)
- `ProductGrid.jsx` (grilla de productos)
- `ProductCard.jsx` (tarjeta individual)
- `BannerCarousel.jsx` (carrusel promocional)
- `CategoryFilter.jsx` (filtros)

**Flujo paso a paso:**
1. **Inicialización**: Home.jsx se monta
2. **Carga de datos**: useEffect llama a `productsApi.getProducts()`
3. **Estado de carga**: Se muestra loading mientras se cargan datos
4. **Renderizado**: ProductGrid recibe productos como props
5. **Tarjetas**: ProductCard renderiza cada producto con:
   - Imagen (con fallback a placeholder)
   - Título, precio, ubicación
   - Botones de acción según propietario
   - Botón de favoritos

**Props utilizadas:**
```javascript
// ProductGrid.jsx
{
  products: Array,
  loading: Boolean,
  error: String
}

// ProductCard.jsx
{
  product: Object
}
```

**Hooks utilizados:**
- `useState`: Para productos, loading, error
- `useEffect`: Para cargar datos al montar
- `useAuth`: Para verificar propietario
- `useCart`: Para funciones del carrito
- `useFavorites`: Para manejar favoritos

**LocalStorage/SessionStorage:**
- Favoritos se persisten por usuario
- Carrito se mantiene entre sesiones

### **2. BÚSQUEDA DE PRODUCTOS**

**Componentes involucrados:**
- `Header.jsx` (barra de búsqueda)
- `Search.jsx` (página de resultados)
- `ProductGrid.jsx` (resultados)

**Flujo paso a paso:**
1. **Input de búsqueda**: Usuario escribe en Header
2. **Navegación**: Se navega a `/search?q={query}`
3. **Obtención de query**: Search.jsx usa `useSearchParams()`
4. **Llamada API**: `searchProducts(query)` se ejecuta
5. **Actualización de estado**: Se actualiza searchResults en AppContext
6. **Renderizado**: ProductGrid muestra resultados filtrados

**React Router utilizado:**
- `useSearchParams()`: Para obtener query de URL
- `useNavigate()`: Para navegación programática
- Ruta: `/search` con query parameter

**Hooks utilizados:**
- `useState`: Para resultados y loading
- `useEffect`: Para búsqueda cuando cambia query
- `useSearchParams`: Para obtener parámetros de URL

### **3. FILTRADO POR CATEGORÍA**

**Componentes involucrados:**
- `CategoryDropdown.jsx` (selector en header)
- `CategoryFilter.jsx` (filtros en home)
- `Category.jsx` (página de categoría)

**Flujo paso a paso:**
1. **Selección**: Usuario selecciona categoría
2. **Navegación**: Se navega a `/category/{categoryName}`
3. **Obtención de parámetros**: Category.jsx usa `useParams()`
4. **Filtrado**: `getProductsByCategory(category)` se ejecuta
5. **Renderizado**: Se muestran productos filtrados

**React Router utilizado:**
- `useParams()`: Para obtener categoría de URL
- Ruta dinámica: `/category/:category`

### **4. DETALLE DE PRODUCTO**

**Componentes involucrados:**
- `ProductDetail.jsx` (página principal)
- `FavoriteButton.jsx` (botón de favoritos)

**Flujo paso a paso:**
1. **Navegación**: Click en producto navega a `/producto/{id}`
2. **Obtención de ID**: ProductDetail usa `useParams()`
3. **Carga de datos**: `getProduct(id)` se ejecuta
4. **Verificación de propietario**: `isProductOwner()` determina botones
5. **Renderizado condicional**:
   - Si es propietario: Botón "Editar"
   - Si no es propietario: Botones "Comprar/Agregar al carrito"

**Props y children:**
- No usa children
- Estado interno con múltiples useState

**Hooks utilizados:**
- `useState`: Para producto, loading, selectedImage, quantity, etc.
- `useEffect`: Para cargar producto al cambiar ID
- `useParams`: Para obtener ID de URL
- `useAuth`: Para verificar propietario
- `useCart`: Para funciones de carrito
- `useNavigate`: Para navegación a panel de vendedor

**Llamadas asíncronas:**
- `getProduct(id)`: Al montar y cambiar ID
- Manejo de errores con try/catch

### **5. INTEGRACIÓN CON PERFIL DE USUARIO**

**Componentes involucrados:**
- `Profile.jsx` (perfil personal)
- `SellerProfile.jsx` (perfil público de vendedor)

**Flujo paso a paso:**
1. **Acceso a perfil**: Click en avatar/nombre en header
2. **Verificación de auth**: ProtectedRoute verifica sesión
3. **Carga de datos**: currentUser desde AuthContext
4. **Renderizado**: Se muestra información personal y de vendedor

**Rutas protegidas:**
- `/profile`: Requiere autenticación
- Uso de `ProtectedRoute` component

---

## 🛒 GESTIÓN DE PRODUCTOS

### **1. MÓDULO DE VENDER**

**Componente principal:**
- `SellerPanel.jsx`

**Flujo paso a paso:**
1. **Acceso**: Navegación a `/vender` (ruta protegida)
2. **Verificación**: ProtectedRoute valida autenticación
3. **Inicialización**: Carga productos del vendedor actual
4. **Navegación interna**: Dos vistas principales:
   - Vista de lista: Muestra productos existentes
   - Vista de formulario: Crear/editar productos

**Estado interno:**
```javascript
{
  products: [],           // Productos del vendedor
  selectedProduct: null,  // Producto en edición
  currentView: 'list',    // 'list' | 'form'
  formData: {...},        // Datos del formulario
  loading: false,
  notification: null
}
```

**Hooks utilizados:**
- `useState`: Para todo el estado interno
- `useEffect`: Para cargar productos y manejar navegación desde otras páginas
- `useAuth`: Para información del vendedor
- `useNavigate`: Para navegación
- `useLocation`: Para recibir productos a editar

### **2. PROCESO DE CREACIÓN DE PRODUCTOS**

**Flujo paso a paso:**
1. **Inicio**: Click en "Nuevo Producto" en SellerPanel
2. **Cambio de vista**: `setCurrentView('form')`
3. **Formulario limpio**: `resetForm()` inicializa estado
4. **Completar datos**: Usuario llena formulario con:
   - Información básica (título, precio, descripción)
   - Categoría y condición
   - Imágenes múltiples (0-8 URLs)
   - Stock y ubicación
   - Tags y envío gratis
5. **Validación**: Se valida antes del envío
6. **Envío**: `handleSubmit()` ejecuta `api.createProduct()`
7. **Actualización**: Se recarga lista de productos
8. **Notificación**: Se muestra mensaje de éxito
9. **Retorno**: Vuelve automáticamente a vista de lista

**Validaciones incluidas:**
- Campos obligatorios (título, precio, descripción, categoría)
- Máximo 8 imágenes
- Precios y stock numéricos
- URLs de imágenes válidas

### **3. PROCESO DE EDICIÓN DE PRODUCTOS**

**Flujo desde ProductDetail:**
1. **Detección**: Sistema detecta que usuario es propietario
2. **Botón editar**: Se muestra "✏️ Editar mi producto"
3. **Navegación**: `navigate('/vender', { state: { editProduct: product } })`
4. **Recepción**: SellerPanel recibe producto en `location.state`
5. **Configuración**: Se cambia a vista de formulario y se pre-cargan datos
6. **Edición**: Usuario modifica campos necesarios
7. **Envío**: `handleSubmit()` ejecuta `api.updateProduct()`

**Flujo desde ProductCard (Home):**
1. **Detección**: ProductCard detecta que usuario es propietario
2. **Botón editar**: Se muestra en actions del card
3. **Mismo flujo**: Idéntico al anterior

**useState para formulario:**
```javascript
{
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
}
```

### **4. PROCESO DE ELIMINACIÓN**

**Flujo paso a paso:**
1. **Botón eliminar**: En lista de productos del vendedor
2. **Confirmación**: `window.confirm()` solicita confirmación
3. **Llamada API**: `api.deleteProduct(id)`
4. **Actualización**: Se actualiza lista local
5. **Notificación**: Mensaje de confirmación

---

## 👥 USUARIOS

### **1. REGISTRO**

**Componente:** `Register.jsx`

**Flujo paso a paso:**
1. **Acceso**: Navegación a `/register`
2. **Formulario**: Usuario completa datos personales
3. **Validación**: Verificación de campos obligatorios
4. **Verificación**: Check de email único
5. **Creación**: Se crea usuario con perfil de vendedor automático
6. **Login automático**: Usuario queda logueado
7. **Redirección**: Navegación a home

**Datos requeridos:**
- Email (único)
- Contraseña
- Nombre
- Apellido

**Auto-generación:**
- ID único
- Perfil de vendedor con nickname
- Avatar placeholder
- Fecha de creación

**Hook utilizado:**
- `useForm`: Para manejo del formulario
- `useAuth`: Para registro y login automático

### **2. LOGIN**

**Componente:** `Login.jsx`

**Flujo paso a paso:**
1. **Acceso**: Navegación a `/login`
2. **Formulario**: Email y contraseña
3. **Validación**: Verificación local de campos
4. **Autenticación**: `login(email, password)` en AuthContext
5. **Verificación**: Búsqueda en base de datos
6. **Sesión**: `setCurrentUser()` y localStorage
7. **Redirección**: A página anterior o home

**Manejo de intenciones pendientes:**
- Si hay `pendingAddToCart` en sessionStorage se procesa tras login
- Preserva destino con `location.state.from`

**Hooks utilizados:**
- `useForm`: Para formulario
- `useAuth`: Para autenticación
- `useNavigate`: Para redirección
- `useLocation`: Para destino de retorno

---

## 🛒 CARRITO

### **1. INTEGRACIÓN CON USUARIOS**

**Estrategia de persistencia:**
- **Usuario no logueado**: `mercadolibre-cart-guest`
- **Usuario logueado**: `mercadolibre-cart-{userId}`
- **Merge automático**: Al hacer login se combinan carritos

**Flujo de merge:**
1. Usuario agrega productos como guest
2. Usuario hace login
3. Sistema detecta carrito guest y carrito de usuario
4. Se suman cantidades por producto
5. Se guarda bajo key del usuario
6. Se elimina carrito guest

### **2. FUNCIONALIDAD DEL CARRITO**

**Componente principal:** `Cart.jsx`

**Características:**
- **Gestión de cantidad**: +/- con validación de stock
- **Eliminación de items**: Individual o limpiar todo
- **Cálculos automáticos**:
  - Subtotal por producto
  - Subtotal total
  - Costo de envío (gratis si todos los productos lo incluyen)
  - Total final

**Validaciones:**
- Stock disponible vs cantidad en carrito
- Máxima cantidad = stock del producto
- Verificación de propietario (no puedes comprar tus productos)

**Hooks utilizados:**
- `useCart`: Para toda la lógica del carrito
- `useAuth`: Para verificar propietario
- `useEffect`: Para cargar carrito

**Ruta protegida:**
- `/cart` y `/carrito` requieren autenticación

---

## ⭐ FAVORITOS

### **1. FUNCIONALIDAD**

**Características:**
- **Solo usuarios logueados**: Se requiere autenticación
- **Persistencia**: localStorage por usuario
- **Toggle**: Agregar/quitar con un click
- **Contador**: En header se muestra cantidad

**Componente principal:** `Favorites.jsx`

**Componente integrado:** `FavoriteButton.jsx`

### **2. INTEGRACIÓN CON USUARIOS**

**Flujo de favoritos:**
1. **Verificación**: Solo usuarios logueados pueden favoritar
2. **Toggle**: `toggleFavorite(product)` en FavoritesContext
3. **Persistencia**: Automática en `favorites_{userId}`
4. **Sincronización**: Entre todos los componentes que usan el producto

**Hooks utilizados:**
- `useFavorites`: Para gestión de favoritos
- `useAuth`: Para verificar autenticación
- `useState`: Para estado local del botón

**LocalStorage:**
- Clave: `favorites_{userId}`
- Valor: Array de productos favoritos completos

---

## 🛣️ RUTAS Y NAVEGACIÓN

### **Configuración de rutas en App.jsx:**

```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/search" element={<Search />} />
  <Route path="/product/:id" element={<ProductDetail />} />
  <Route path="/producto/:id" element={<ProductDetail />} />
  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
  <Route path="/carrito" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
  <Route path="/favorites" element={<Favorites />} />
  <Route path="/favoritos" element={<Favorites />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/vender" element={<ProtectedRoute><SellerPanel /></ProtectedRoute>} />
  <Route path="/vendedor/:sellerId" element={<SellerProfile />} />
  <Route path="/category/:category" element={<Category />} />
</Routes>
```

### **Rutas protegidas:**
- `/cart` y `/carrito`: Requieren autenticación
- `/vender`: Panel de vendedor requiere autenticación
- Implementadas con `ProtectedRoute` component

### **Parámetros de URL:**
- `useParams()` en ProductDetail para obtener `:id`
- `useParams()` en Category para obtener `:category`
- `useParams()` en SellerProfile para obtener `:sellerId`
- `useSearchParams()` en Search para obtener query

### **Navegación programática:**
- `useNavigate()` para redirecciones
- Estado en navegación: `navigate('/path', { state: { data } })`
- `useLocation()` para recibir estado y destino de retorno

---

## 💾 MANEJO DE ESTADO LOCAL

### **LocalStorage utilizado:**

1. **Autenticación:**
   - `currentUser`: Sesión del usuario

2. **Carrito:**
   - `mercadolibre-cart-guest`: Carrito de invitado
   - `mercadolibre-cart-{userId}`: Carrito por usuario

3. **Favoritos:**
   - `favorites_{userId}`: Favoritos por usuario

### **SessionStorage utilizado:**

1. **Intenciones pendientes:**
   - `pendingAddToCart`: Producto a agregar tras login

### **Estado temporal (useState):**

**Por componente principales:**
- **ProductDetail**: producto, loading, selectedImage, quantity, isZoomed, mousePosition
- **SellerPanel**: products, selectedProduct, currentView, formData, loading, notification
- **Search**: searchResults, loading, error
- **Cart**: Usa principalmente useCart hook

### **Persistencia y sincronización:**
- **Automática**: Context providers manejan persistencia
- **Merge inteligente**: Entre sesiones guest y usuario
- **Limpieza**: Se eliminan datos obsoletos automáticamente

---

## 🔄 LLAMADAS ASÍNCRONAS Y PROMESAS

### **Ubicaciones principales:**

1. **AuthContext:**
   - `register()`: POST a `/users`
   - `login()`: GET a `/users?email=${email}`
   - `useEffect`: GET a `/users/${id}` para datos completos

2. **Servicios (api.js):**
   - `getProducts()`: GET a `/products`
   - `getProduct(id)`: GET a `/products/${id}`
   - `searchProducts(query)`: GET a `/products?q=${query}`
   - `createProduct()`: POST a `/products`
   - `updateProduct()`: PATCH a `/products/${id}`
   - `deleteProduct()`: DELETE a `/products/${id}`

3. **Componentes de páginas:**
   - **Home**: `useEffect` para cargar productos iniciales
   - **ProductDetail**: `useEffect` para cargar producto por ID
   - **Search**: `useEffect` para búsqueda por query
   - **SellerPanel**: `useEffect` para cargar productos del vendedor

### **Patrón de manejo:**
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.someMethod();
      // Procesar datos
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, [dependency]);
```

### **Fallback y resilencia:**
- **api.js** tiene fallback a `localProductsService`
- Manejo de errores en cada llamada
- Estados de loading y error en UI

---

## 📱 COMPONENTES POR FUNCIONALIDAD

### **Header.jsx**
- **Propósito**: Navegación principal y búsqueda
- **Children**: No usa children
- **Props**: No recibe props
- **Hooks**: useAuth, useCart, useFavorites, useNavigate
- **Estado**: searchQuery (local)

### **ProductCard.jsx**
- **Propósito**: Tarjeta de producto reutilizable
- **Props**: `{ product }`
- **Children**: No usa children
- **Hooks**: useAuth, useCart, useFavorites, useNavigate
- **Características**: Botones contextuales según propietario

### **ProductGrid.jsx**
- **Propósito**: Grilla responsiva de productos
- **Props**: `{ products, loading, error }`
- **Children**: ProductCard components
- **Hooks**: Ninguno (componente presentacional)

### **FavoriteButton.jsx**
- **Propósito**: Botón de favoritos reutilizable
- **Props**: `{ product, size, className }`
- **Children**: No usa children
- **Hooks**: useFavorites, useAuth
- **Estado**: Ninguno (todo desde context)

### **ProtectedRoute.jsx**
- **Propósito**: Proteger rutas que requieren autenticación
- **Props**: `{ children }`
- **Children**: Renderiza children si hay usuario
- **Hooks**: useAuth, useNavigate, useLocation
- **Lógica**: Redirección a login con destino de retorno

---

## 📋 RESUMEN DE ARQUITECTURA

### **Patrón de diseño:**
- **Flux/Redux-like**: Con useReducer en contexts
- **Container/Presentational**: Separación de lógica y vista
- **Custom hooks**: Para lógica reutilizable
- **Context providers**: Para estado global

### **Gestión de estado:**
- **Global**: React Context (Auth, App, Favorites)
- **Local**: useState para estado de componente
- **Persistente**: localStorage para datos importantes
- **Temporal**: sessionStorage para intenciones

### **Comunicación con API:**
- **JSON Server**: API REST simulada
- **Fallback**: Servicio local para resilencia
- **Async/Await**: Patrón moderno de promesas
- **Error handling**: Try/catch en todas las llamadas

### **Navegación:**
- **React Router v6**: Enrutamiento declarativo
- **Rutas protegidas**: Con componente ProtectedRoute
- **Parámetros dinámicos**: Para productos y categorías
- **Estado en navegación**: Para pasar datos entre páginas

Esta documentación cubre todos los aspectos del proyecto, desde la arquitectura hasta los detalles de implementación específicos. Cada flujo está documentado con sus componentes, hooks, props y manejo de estado correspondiente.