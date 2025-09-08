# 🧪 Guía de Pruebas - Catálogo MercadoLibre

## 🚀 Pasos para Probar

### 1. Verificar Servidores Activos

**✅ JSON-Server (API)**
- URL: http://localhost:3002/products
- Debe mostrar lista de productos en JSON

**✅ Vite Dev (Frontend)**  
- URL: http://localhost:5173/
- Debe mostrar la página principal

### 2. Probar Catálogo Principal

**📍 Ir a: http://localhost:5173/**

**✅ Verificaciones:**
- [ ] Se cargan productos de la base de datos
- [ ] Productos ordenados alfabéticamente
- [ ] Filtros por categoría funcionan
- [ ] Botones "Agregar al carrito" visibles
- [ ] Productos sin stock muestran "Sin stock"

**🔍 Categorías esperadas:**
- anteojos
- audio  
- celulares
- computacion
- deportes
- electrodomesticos

### 3. Probar Agregar al Carrito

**📝 Pasos:**
1. Click en "Agregar al carrito" en cualquier producto
2. Verificar que aparece notificación/feedback
3. Click en ícono del carrito (Header)
4. **✅ Verificar**: Producto aparece en carrito

**⚠️ Problema anterior CORREGIDO:** El carrito ya NO se vacía automáticamente

### 4. Probar Detalle de Producto

**📝 Pasos:**
1. Click en cualquier tarjeta de producto
2. **✅ Verificar**: Navega a `/producto/{id}`
3. **✅ Verificar**: Muestra información completa
4. **✅ Verificar**: Selector de cantidad funciona
5. Click "Agregar al carrito"
6. **✅ Verificar**: Se agrega al carrito

**🎯 URLs de prueba:**
- http://localhost:5173/producto/1 (iPhone)
- http://localhost:5173/producto/7 (Ray-Ban)

### 5. Probar Gestión del Carrito

**📍 Ir a: http://localhost:5173/cart**

**📝 Funcionalidades a probar:**
- [ ] Ver productos agregados
- [ ] Modificar cantidades con +/-
- [ ] Eliminar productos individuales
- [ ] Vaciar carrito completo
- [ ] Ver subtotal y total correcto
- [ ] Verificar límites de stock

### 6. Probar Persistencia del Carrito

**📝 Pasos críticos:**
1. Agregar varios productos al carrito
2. **REFRESCAR la página (F5)**
3. **✅ VERIFICAR**: Carrito mantiene productos
4. Cerrar pestaña y reabrir
5. **✅ VERIFICAR**: Carrito sigue con productos

**🔧 Esto estaba roto y ahora está CORREGIDO**

### 7. Probar Filtros y Ordenamiento

**📝 Pasos:**
1. Aplicar filtro por categoría (ej: "celulares")
2. **✅ Verificar**: Solo muestra iPhone y Samsung
3. Cambiar orden por precio
4. **✅ Verificar**: Productos se reordenan
5. Quitar filtro
6. **✅ Verificar**: Vuelve a mostrar todos

### 8. Probar Validación de Stock

**🎯 Productos específicos para probar:**

**Stock Alto (Nike Air Max - 20 unidades):**
- Agregar varias veces al carrito
- Verificar que permite hasta 20

**Stock Bajo (Samsung TV - 5 unidades):**
- Agregar hasta límite
- Verificar que se deshabilita botón

**Sin Stock (si hay alguno):**
- Verificar botón deshabilitado
- Texto "Sin stock"

### 9. Verificar Cálculos de Precio

**📝 Verificaciones:**
- [ ] Precios en formato argentino ($ 899.999)
- [ ] Subtotal correcto por producto
- [ ] Total general correcto
- [ ] Envío gratis/pago mostrado correctamente

### 10. Probar Navegación

**📝 URLs a probar:**
- http://localhost:5173/ (Home)
- http://localhost:5173/cart (Carrito)
- http://localhost:5173/producto/1 (Detalle)
- http://localhost:5173/search (Búsqueda)

## 🚨 Problemas Resueltos

### ❌ **ANTES**: Carrito se vaciaba al refrescar
### ✅ **AHORA**: Carrito persiste correctamente

### ❌ **ANTES**: Usaba productos locales ficticios  
### ✅ **AHORA**: Usa base de datos real (db.json)

### ❌ **ANTES**: Validación de stock inconsistente
### ✅ **AHORA**: Validación robusta en tiempo real

## 📊 Métricas de Éxito

**✅ Todos los tests pasan:** Funcionalidad completa
**✅ Sin errores de consola:** Código limpio  
**✅ Carrito persistente:** localStorage funcional
**✅ Stock validado:** No se puede exceder límites
**✅ Base de datos real:** Productos reales de db.json

## 🎉 Estado: **COMPLETADO**

El catálogo está completamente funcional y listo para usar con la base de datos existente.
