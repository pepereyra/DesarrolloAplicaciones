// Importamos React.
import React from 'react';

// --- 1. IMPORTACIÓN DE COMPONENTES Y CONTEXTO ---
// Importamos el Provider que envolverá nuestra página para darle acceso al estado global.
import { CartProvider } from './CartContext.jsx';
// Importamos los componentes que consumirán el contexto.
import ProductList from './ProductList.jsx';
import CartSummary from './CartSummary.jsx';

// --- 2. COMPONENTE PRINCIPAL (PÁGINA) QUE UNE TODO ---
// Este componente actúa como una "página" que organiza la estructura.
function CartPage() {
  return (
    // Envolvemos toda la página con nuestro `CartProvider`.
    // Ahora, cualquier componente hijo (ProductList, CartSummary, etc.) puede usar
    // el hook `useCart()` para acceder al estado del carrito.
    <CartProvider>
      <h1>Mi Tienda (Ejemplo de useContext)</h1>
      <p>Agrega productos al carrito y verás cómo se actualiza el resumen en la esquina superior derecha, ¡sin pasar props!</p>
      {/* Renderizamos los componentes consumidores. */}
      <ProductList />
      <CartSummary />
    </CartProvider>
  );
}

export default CartPage;
