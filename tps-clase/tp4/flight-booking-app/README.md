# 🛫 Flight Booking Card - Aplicación React

Una aplicación de reserva de vuelos desarrollada con React y Vite que demuestra el uso de componentes con props, funciones y children.

## 📋 Características del Componente

### ✅ Props con Valores
- **nombre**: Nombre del pasajero
- **ocupacion**: Ocupación/profesión del pasajero  
- **edad**: Edad del pasajero

### ✅ Props con Funciones
- **onReservar**: Función callback que se ejecuta al confirmar la reserva
- **onCancelar**: Función callback que se ejecuta al cancelar la reserva

### ✅ Props Children
- Contenido personalizable que se muestra en la sección de detalles del vuelo
- Permite incluir información específica como:
  - Destinos y horarios
  - Precios y clases de servicio
  - Ofertas especiales
  - Beneficios familiares

## 🚀 Funcionalidades

- **Gestión de Estado**: Utiliza `useState` para manejar:
  - Estado de reserva (reservado/disponible)
  - Contador de pasajeros (1-9)
  
- **Interactividad**: 
  - Botones para incrementar/decrementar pasajeros
  - Botón de reservar/cancelar con cambio de estado visual
  - Callbacks a funciones padre
  
- **Diseño Responsivo**: 
  - Adaptable a diferentes tamaños de pantalla
  - Efectos visuales y animaciones CSS
  - Gradientes y efectos de glass morphism

## 🛠️ Tecnologías Utilizadas

- **React 18**: Biblioteca para interfaces de usuario
- **Vite**: Herramienta de desarrollo rápida
- **CSS3**: Estilos avanzados con gradientes y efectos
- **JavaScript ES6+**: Sintaxis moderna

## 📦 Instalación y Ejecución

```bash
# Navegar al directorio del proyecto
cd flight-booking-app

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

## 🎯 Ejemplos de Uso

El archivo `App.jsx` incluye tres ejemplos diferentes:

1. **Pasajero Ejecutivo**: Vuelo Buenos Aires → Madrid con clase ejecutiva
2. **Estudiante**: Vuelo Córdoba → Barcelona con descuento estudiantil
3. **Familia**: Vuelo Mendoza → Roma con beneficios familiares

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── FlightBookingCard.jsx    # Componente principal
│   └── FlightBookingCard.css    # Estilos del componente
├── App.jsx                      # Aplicación principal
├── App.css                      # Estilos generales
├── index.css                    # Estilos base
└── main.jsx                     # Punto de entrada
```

## 🎨 Características de Diseño

- **Gradientes dinámicos**: Azul para disponible, verde para reservado
- **Efectos de hover**: Elevación y sombras
- **Responsive design**: Adaptable a móviles y tablets
- **Iconografía**: Emojis para mejorar la experiencia visual
- **Glass morphism**: Efectos de transparencia y blur

## 👨‍💻 Conceptos React Demostrados

- ✅ **Componentes funcionales**
- ✅ **Props (propiedades)**
- ✅ **Props con funciones (callbacks)**
- ✅ **Props children**
- ✅ **useState Hook**
- ✅ **Manejo de eventos**
- ✅ **Renderizado condicional**
- ✅ **Componentización y reutilización**

---

Desarrollado como práctica personal para el curso de Aplicaciones Interactivas - UADE 2025+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
