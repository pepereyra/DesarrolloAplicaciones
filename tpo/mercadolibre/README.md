# MercadoLibre Clone - E-commerce React App

Un prototipo de e-commerce inspirado en Mercado Libre, desarrollado con React, Vite y json-server.

## 🚀 Características

### Funcionalidades Implementadas
- ✅ **Header con buscador** similar a Mercado Libre
- ✅ **Página principal (Home)** con productos destacados y categorías
- ✅ **Listado de productos** en cards con precio, envío gratis y cuotas
- ✅ **Búsqueda de productos** con filtros y ordenamiento
- ✅ **Detalle de producto** con galería, descripción e información del vendedor
- ✅ **Carrito de compras** con detalle de productos y resumen de compra
- ✅ **Context API** para manejo de estado global
- ✅ **JSON Server** para simular API de productos y usuarios
- ✅ **Diseño responsive** inspirado en Mercado Libre

### Pantallas Incluidas
- 🏠 **Home**: Página principal con productos destacados
- 🔍 **Search**: Búsqueda con filtros avanzados
- 📱 **ProductDetail**: Detalle completo del producto
- 🛒 **Cart**: Carrito con resumen de compra
- 🔐 **Login/Register**: (Próximamente)
- 👑 **Admin**: Panel de administración (Próximamente)

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19 + Vite
- **Routing**: React Router DOM v7
- **State Management**: Context API + useReducer
- **Mock API**: JSON Server
- **Styling**: CSS3 con variables CSS
- **Icons**: SVG icons personalizados

## 📦 Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn

### Pasos para ejecutar el proyecto

1. **Clonar o descargar el proyecto**
   ```bash
   cd mercadolibre-clone
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo (React)**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en: http://localhost:5173

4. **Ejecutar el servidor JSON (API Mock)**
   En otra terminal, ejecutar:
   ```bash
   npm run server
   ```
   La API estará disponible en: http://localhost:3002

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo de Vite
- `npm run server` - Inicia json-server en puerto 3002
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta ESLint para revisar el código

## 📱 Uso de la Aplicación

### Navegación Principal
1. **Página de Inicio**: Explora productos destacados y categorías
2. **Búsqueda**: Usa el buscador del header para encontrar productos
3. **Filtros**: En la página de búsqueda, filtra por precio, condición, categoría, etc.
4. **Detalle de Producto**: Click en cualquier producto para ver detalles completos
5. **Agregar al Carrito**: Desde el detalle o usando el botón flotante en las cards
6. **Carrito**: Revisa tus productos, ajusta cantidades y ve el resumen

### Funcionalidades del Carrito
- ✅ Agregar productos con cantidades personalizadas
- ✅ Actualizar cantidades de productos existentes
- ✅ Eliminar productos individuales
- ✅ Vaciar carrito completo
- ✅ Persistencia en localStorage
- ✅ Separación por tipo de envío (gratis/pago)
- ✅ Cálculo de totales y costos de envío
- ✅ Simulador de cuotas

### Datos de Prueba
La aplicación incluye productos de ejemplo en las siguientes categorías:
- 📱 Celulares (iPhone, Samsung)
- 💻 Computación (Notebooks)
- 🔌 Electrodomésticos (Smart TV)
- ⚽ Deportes (Zapatillas)
- 🎧 Audio (Auriculares)

## 🎨 Diseño y Estilo

### Paleta de Colores (inspirada en Mercado Libre)
- **Amarillo principal**: #fff159
- **Azul enlaces**: #3483fa
- **Verde ofertas**: #00a650
- **Rojo alertas**: #ff4757
- **Grises**: #333, #666, #999, #e6e6e6

### Responsive Design
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (hasta 767px)

## 🔧 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.jsx      # Header con navegación y buscador
│   └── ProductCard.jsx # Card de producto
├── pages/              # Páginas/rutas principales
│   ├── Home.jsx        # Página principal
│   ├── Search.jsx      # Página de búsqueda
│   ├── ProductDetail.jsx # Detalle de producto
│   └── Cart.jsx        # Carrito de compras
├── context/            # Context API para estado global
│   └── AppContext.jsx  # Provider principal de la app
├── services/           # Servicios para API
│   └── api.js          # Funciones para conectar con json-server
└── styles/             # Archivos CSS por componente
```

## 🚧 Próximas Funcionalidades

### En Desarrollo
- 🔐 **Sistema de Login/Registro**
- 👑 **Panel de Administración**
- 📊 **Dashboard de ventas**
- 💳 **Simulador de checkout**
- ⭐ **Sistema de favoritos**
- 📝 **Reseñas y calificaciones**
- 🏪 **Perfil de vendedor**

### Mejoras Técnicas Planificadas
- 🔄 **React Query** para cache de datos
- 🎨 **Styled Components** o **Tailwind CSS**
- 🔐 **Autenticación JWT**
- 📱 **PWA** (Progressive Web App)
- 🧪 **Testing** con Jest y React Testing Library

## 🤝 Contribución

Este es un proyecto educativo. Las sugerencias y mejoras son bienvenidas:

1. Fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto es solo para fines educativos y de demostración.

## 📞 Contacto

Proyecto desarrollado como parte del curso de Desarrollo de Aplicaciones - UADE

---

**¡Disfrutá explorando este clon de Mercado Libre!** 🛒✨+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
