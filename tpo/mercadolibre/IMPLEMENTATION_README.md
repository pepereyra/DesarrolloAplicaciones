# Catálogo de Productos MercadoLibre

## Implementación Completada

Este proyecto implementa un catálogo de productos completo con carrito de compras, respetando estrictamente la estructura existente del proyecto.

## Archivos Modificados/Creados

### Nuevos Archivos:
1. **`/public/data/products.json`** - Base de datos de productos locales con 25 productos en 5 categorías
2. **`/src/services/localProductsService.js`** - Servicio para manejar productos locales 
3. **`/src/hooks/useCart.js`** - Hook personalizado para gestión del carrito

### Archivos Modificados:
1. **`/src/services/api.js`** - Integración con productos locales como fuente principal
2. **`/src/context/AppContext.jsx`** - Mejoras en validación de stock y persistencia del carrito
3. **`/src/pages/Home.jsx`** - Ordenamiento por nombre ascendente por defecto y filtros optimizados
4. **`/src/components/ProductCard.jsx`** - Integración con useCart hook y nueva ruta `/producto/:id`
5. **`/src/pages/Cart.jsx`** - Integración con useCart hook para mejor gestión del carrito
6. **`/src/pages/ProductDetail.jsx`** - Reescrito para usar useCart hook y gestión mejorada de stock
7. **`/src/App.jsx`** - Agregada ruta `/producto/:id` para detalle de productos

## Funcionalidades Implementadas

### ✅ Catálogo de Productos
- **Fuente de datos**: `products.json` con 25 productos en 5 categorías
- **Categorías incluidas**: Anteojos de sol, Laptops, Freidoras de aire, Televisores, Electrodomésticos
- **Ordenamiento**: Por nombre ascendente (default), con opciones precio asc/desc
- **Filtrado**: Por categoría usando chips/select
- **Stock**: Productos sin stock muestran "Sin stock" y botón deshabilitado

### ✅ Carrito de Compras
- **Agregar productos**: Respeta stock disponible
- **Gestión de cantidad**: Controles +/− con validación de stock
- **Eliminar items**: Individual o vaciar carrito completo
- **Cálculos**: Subtotal por ítem y total general con 2 decimales
- **Validación**: Stock verificado en cada operación
- **Persistencia**: localStorage con validación de datos

### ✅ Detalle de Producto
- **Ruta**: `/producto/:id` (mantiene compatibilidad con `/product/:id`)
- **Información completa**: Imagen, descripción, precio, stock, vendedor
- **Selector de cantidad**: Con límites basados en stock disponible
- **Acciones**: "Agregar al carrito" y "Comprar ahora"

### ✅ Arquitectura
- **Contexto preservado**: AppContext sin cambios breaking
- **Hook personalizado**: useCart para reutilización
- **Fallback**: Si falla carga local, usa json-server como respaldo
- **Imágenes**: Placeholders automáticos por categoría
- **Compatibilidad**: Mantiene estructura de datos existente

## Instrucciones de Desarrollo

### 1. Iniciar el Proyecto
```bash
cd api-master/tpo/mercadolibre
npm install
npm run dev
```

### 2. Verificar Funcionamiento
1. **Home** (http://localhost:5173/): 
   - Debe mostrar 25 productos ordenados alfabéticamente
   - Filtros por categoría funcionales
   - Productos sin stock marcados correctamente

2. **Catálogo**:
   - Click en cualquier producto para ir a detalle
   - Usar filtros de categoría
   - Probar botones "Agregar al carrito"

3. **Detalle de Producto**:
   - Acceder via `/producto/p-001` 
   - Probar selector de cantidad
   - Verificar límites de stock

4. **Carrito** (http://localhost:5173/cart):
   - Agregar múltiples productos
   - Modificar cantidades con +/-
   - Verificar cálculos de subtotal y total
   - Probar "Vaciar carrito"

### 3. Testing de Stock
- **Producto con stock alto**: p-021 (Oster Freidora - 25 unidades)
- **Producto sin stock**: p-024 (Philips TV - 0 unidades)  
- **Producto stock bajo**: p-023 (Persol - 3 unidades)

### 4. Validaciones a Verificar
- ✅ No se puede agregar más cantidad que stock disponible
- ✅ Productos sin stock muestran "Sin stock" y botón deshabilitado
- ✅ Carrito persiste en localStorage
- ✅ Cálculos de precio correctos (formato AR$)
- ✅ Filtros por categoría funcionan
- ✅ Ordenamiento alfabético por defecto

## Estructura de Datos

### Producto (products.json)
```json
{
  "id": "p-001",
  "nombre": "Ray-Ban Wayfarer",
  "categoria": "Anteojos de sol",
  "descripcion": "Lentes polarizadas con protección UV 100%",
  "precio": 189999.99,
  "stock": 12,
  "imagen": "/images/products/rayban-wayfarer.jpg"
}
```

### Categorías Disponibles
- **Anteojos de sol**: 4 productos
- **Laptops**: 5 productos  
- **Freidoras de aire**: 4 productos
- **Televisores**: 4 productos
- **Electrodomésticos**: 8 productos

## Criterios de Aceptación ✅

1. ✅ **Home muestra catálogo desde JSON, ordenado alfabéticamente**
2. ✅ **Filtro por categoría funciona correctamente**
3. ✅ **Carrito permite agregar/eliminar/ajustar cantidades respetando stock**
4. ✅ **Total se calcula correctamente con 2 decimales**
5. ✅ **Build/linter se mantienen sin errores**
6. ✅ **No se rompió funcionalidad existente**

## Notas Técnicas

- **Compatibilidad**: Mantiene soporte para rutas y estructura existente
- **Performance**: Carga local de productos (más rápido que API)
- **UX**: Estados de carga y error manejados correctamente
- **Accesibilidad**: Labels, ARIA y estados de botones apropiados
- **Responsive**: Mantiene el diseño responsive existente

El proyecto está listo para producción con todas las funcionalidades solicitadas implementadas.
