# Resumen de Integración Backend-Frontend

## Fecha: 21 de Octubre de 2025

## Problemas Identificados

1. **Error de conexión**: El frontend no podía conectarse al backend en `http://localhost:8080`
2. **Estructura de datos incompatible**: El backend devuelve datos paginados con estructura `{ content: [...], totalElements: 20, ... }` pero el frontend esperaba un array directo
3. **Nombres de campos diferentes**: 
   - Backend: `nombre`, `precio`, `categoria`, `imagenes`
   - Frontend esperaba: `title`, `price`, `category`, `images`
4. **Usuario en localStorage**: Error al intentar cargar un usuario con ID 9 que no existe en el backend
5. **Imágenes placeholder**: Problemas con URLs de `via.placeholder.com`

## Soluciones Implementadas

### 1. Archivo `api.js` - Mapeo de Productos

Se agregó una función `mapProductFromBackend()` que convierte la estructura del backend al formato esperado por el frontend:

```javascript
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
```

### 2. Actualización de Métodos de API

Se actualizaron todos los métodos para:
- Manejar la estructura paginada del backend (`.content`)
- Mapear productos usando `mapProductFromBackend()`
- Agregar `?size=100` para obtener más productos por página
- Corregir el endpoint de búsqueda de `/productos/buscar` a `/productos/search`

**Métodos actualizados:**
- `getProducts()`: Ahora extrae `data.content` y mapea los productos
- `getProduct(id)`: Mapea el producto individual
- `getProductsByCategory()`: Maneja paginación y mapeo
- `searchProducts()`: Corrige el endpoint y maneja paginación
- `getCategories()`: Actualizado para usar el campo `category` mapeado

### 3. Archivo `AuthContext.jsx` - Manejo de Errores

Se mejoró el manejo de errores al cargar usuarios:

```javascript
if (response.ok) {
    const completeUser = await response.json();
    setCurrentUser(completeUser);
    localStorage.setItem('currentUser', JSON.stringify(completeUser));
} else {
    // Si el usuario no existe en el backend, limpiar el localStorage
    console.warn('Usuario no encontrado en el backend, limpiando sesión local');
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
}
```

## Estructura de Datos del Backend

### Endpoint: GET /api/productos

**Respuesta:**
```json
{
  "content": [
    {
      "id": "1",
      "nombre": "iPhone 14 Pro 128GB",
      "descripcion": "iPhone 14 Pro 128GB",
      "precio": 899999,
      "categoria": "celulares",
      "imagenes": [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600"
      ],
      "activo": true,
      "vendedorNombre": "Juan Pérez",
      "fechaCreacion": "2025-10-21T17:37:44",
      "esFavorito": false
    }
  ],
  "totalPages": 2,
  "totalElements": 20,
  "size": 10,
  "number": 0
}
```

### Endpoints Disponibles

- `GET /api/productos?size=100` - Obtener todos los productos (paginado)
- `GET /api/productos/{id}` - Obtener producto por ID
- `GET /api/productos/search?q={query}&size=100` - Buscar productos
- `GET /api/productos/categoria/{categoria}?size=100` - Productos por categoría
- `GET /api/productos/{id}/relacionados?limit=4` - Productos relacionados

## Estado de la Integración

✅ **Backend**: Corriendo en `http://localhost:8080`
✅ **Frontend**: Corriendo en `http://localhost:5173`
✅ **Mapeo de datos**: Implementado correctamente
✅ **Manejo de errores**: Mejorado
✅ **Categorías**: Funcionando correctamente

## Próximos Pasos Sugeridos

1. **Autenticación**: Implementar JWT tokens para la autenticación
2. **Carrito de compras**: Integrar con el backend
3. **Favoritos**: Conectar con el backend
4. **Imágenes**: Subir imágenes reales o usar un servicio como Cloudinary
5. **Paginación**: Implementar scroll infinito o paginación en el frontend
6. **Manejo de errores**: Agregar notificaciones visuales para errores de API

## Notas Importantes

- El backend usa precios en centavos (ej: 899999 = $8999.99)
- El frontend espera precios en la misma unidad
- Las imágenes deben ser URLs válidas (el backend tiene algunas imágenes de ejemplo de Unsplash)
- Los productos sin imágenes mostrarán un placeholder
- El stock se establece por defecto en 100 en el mapeo (debería venir del backend)
