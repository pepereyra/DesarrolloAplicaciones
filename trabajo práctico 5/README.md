# E-commerce React con Hooks

Aplicación de e-commerce desarrollada con React utilizando los hooks principales: `useState`, `useEffect` y `useContext`.

## Características

- ✅ **useState**: Manejo de estado local en componentes
- ✅ **useEffect**: Llamadas a API y efectos secundarios
- ✅ **useContext**: Compartir estado global del carrito entre componentes
- ✅ **JSON Server**: API REST simulada
- ✅ **Responsive Design**: Adaptable a diferentes dispositivos
- ✅ **Filtros por categoría**: Electronics, Clothing, Books, Food
- ✅ **Carrito de compras**: Agregar, eliminar, modificar cantidades

## Estructura del Proyecto

```
src/
├── components/
│   ├── ProductCard.jsx     # Componente individual de producto
│   ├── ProductCard.css
│   ├── ProductList.jsx     # Lista de productos con useState y useEffect
│   ├── ProductList.css
│   ├── CartSummary.jsx     # Resumen del carrito con useContext
│   └── CartSummary.css
├── contexts/
│   └── CartContext.jsx     # Contexto global del carrito
├── services/
│   └── productService.js   # Servicios para API calls
├── App.jsx                 # Componente principal
├── App.css
└── main.jsx               # Punto de entrada
```

## Instalación y Uso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar JSON Server (en una terminal)
```bash
npm run json-server
```
Esto iniciará la API en `http://localhost:3001`

### 3. Iniciar la aplicación React (en otra terminal)
```bash
npm run dev
```
Esto iniciará la aplicación en `http://localhost:3000`

## Hooks Utilizados

### useState
- **ProductList**: Maneja estado de productos, loading, errores y filtros
- **CartContext**: Maneja el estado del carrito (items, cantidades)

### useEffect
- **ProductList**: Llama a la API cuando el componente se monta o cambian los filtros
- **Dependencias**: Array de dependencias para controlar cuándo se ejecuta

### useContext
- **CartContext**: Provee estado global del carrito
- **CartSummary**: Consume el contexto para mostrar y manipular el carrito
- **ProductCard**: Consume el contexto para agregar productos

## API Endpoints

- `GET /products` - Obtener todos los productos
- `GET /products?category=Electronics` - Filtrar por categoría
- `GET /products/:id` - Obtener producto específico

## Mejores Prácticas Implementadas

1. **Separación de responsabilidades**: Componentes, contextos y servicios separados
2. **Custom Hook**: `useCart()` para encapsular lógica del carrito
3. **Error Handling**: Manejo de errores en llamadas a API
4. **Loading States**: Estados de carga para mejor UX
5. **Responsive Design**: Mobile-first approach
6. **Prop Validation**: ESLint configurado para detectar errores
7. **Code Splitting**: Componentes modulares y reutilizables

## Datos de Ejemplo

La aplicación incluye 8 productos de muestra en diferentes categorías:
- Electronics: Smartphone, Laptop, Auriculares, Apple Watch
- Clothing: Camiseta Nike, Zapatillas Adidas
- Books: Libro JavaScript Moderno
- Food: Café Premium

## Scripts Disponibles

- `npm run dev` - Iniciar desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de producción
- `npm run json-server` - Iniciar API simulada
