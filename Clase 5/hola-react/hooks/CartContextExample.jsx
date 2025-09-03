// Importamos las herramientas necesarias de React.
import React, { useState, useEffect, useContext, createContext } from 'react';

// --- 1. CREACIÓN DEL CONTEXTO ---
// `createContext` crea un objeto de contexto. Piensa en él como un "túnel" de datos global.
// Lo que pongamos en el 'Provider' (proveedor) estará disponible para cualquier componente
// que esté dentro y que use 'useContext' para "escuchar" este túnel.
const CartContext = createContext();

// --- 2. CREACIÓN DEL PROVEEDOR (PROVIDER) ---
// El proveedor es un componente que "provee" el valor del contexto a sus hijos.
// Usará `useState` para manejar la lógica del estado del carrito.
function CartProvider({ children }) {
  // Estado para guardar los productos que están en el carrito. Inicia como un array vacío.
  const [cartItems, setCartItems] = useState([]);

  // Función para agregar un producto al carrito.
  const addToCart = (product) => {
    // Actualizamos el estado del carrito.
    // Creamos un nuevo array con los items anteriores (...prevItems) y el nuevo producto.
    setCartItems(prevItems => [...prevItems, product]);
    console.log(`${product.nombre} agregado al carrito!`);
  };

  // Este es el objeto 'value' que será accesible para todos los componentes consumidores.
  // Contiene tanto el estado (los items) como las funciones para modificarlo (addToCart).
  const value = {
    cartItems,
    addToCart,
  };

  // El componente Provider de nuestro contexto envuelve a los componentes hijos ('children').
  // Todo lo que esté dentro de <CartContext.Provider> podrá acceder al 'value'.
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// --- 3. COMPONENTE CONSUMIDOR: LISTA DE PRODUCTOS ---
// Este componente mostrará los productos y usará el contexto para agregar al carrito.
function ProductList() {
  // `useContext` es el hook que nos permite "conectar" con el contexto.
  // Le pasamos el objeto de contexto (CartContext) y nos devuelve el 'value' que el Provider está proveyendo.
  // Desestructuramos para obtener directamente la función `addToCart`.
  const { addToCart } = useContext(CartContext);

  // Estado local de este componente para manejar la lista de productos de la API.
  const [productos, setProductos] = useState([]);

  // `useEffect` para cargar los productos desde json-server una sola vez.
  useEffect(() => {
    fetch('http://localhost:3000/productos')
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []); // El array vacío asegura que se ejecute solo al montar el componente.

  // Renderizamos la lista de productos.
  return (
    <div>
      <h2>Productos Disponibles</h2>
      {productos.map(product => (
        <div key={product.id} style={{ border: '1px solid #eee', padding: '10px', margin: '5px' }}>
          <span>{product.nombre} - ${product.precio}</span>
          {/* Al hacer clic, llamamos a la función `addToCart` que obtuvimos del contexto. */}
          <button onClick={() => addToCart(product)} style={{ marginLeft: '10px' }}>
            Agregar al Carrito
          </button>
        </div>
      ))}
    </div>
  );
}

// --- 4. OTRO COMPONENTE CONSUMIDOR: EL ÍCONO/RESUMEN DEL CARRITO ---
// Este componente puede estar en cualquier otro lugar de la app y también accederá al carrito.
function CartSummary() {
  // Nos conectamos al mismo contexto para obtener el estado `cartItems`.
  const { cartItems } = useContext(CartContext);

  // Renderizamos un resumen del carrito.
  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px', border: '2px solid black', padding: '10px', background: 'white' }}>
      <h3>🛒 Carrito</h3>
      {/* Mostramos la cantidad de items en el carrito. */}
      <p>Items: {cartItems.length}</p>
      <ul>
        {/* Mostramos los nombres de los primeros 5 items en el carrito */}
        {cartItems.slice(0, 5).map((item, index) => (
          <li key={index}>{item.nombre}</li>
        ))}
        {cartItems.length > 5 && <li>...y más</li>}
      </ul>
    </div>
  );
}

// --- 5. COMPONENTE PRINCIPAL QUE UNE TODO ---
// Este es el componente que exportaremos y usaremos en nuestra aplicación.
function EcommerceWithContext() {
  return (
    // 1. Envolvemos toda la aplicación (o la parte que lo necesite) con nuestro `CartProvider`.
    <CartProvider>
      <h1>Mi Tienda (Ejemplo de useContext)</h1>
      <p>Agrega productos al carrito y verás cómo se actualiza el resumen en la esquina superior derecha, ¡sin pasar props!</p>

      {/* 2. Renderizamos los componentes consumidores. */}
      {/* Ambos componentes están "desconectados" en el árbol de componentes, */}
      {/* pero ambos pueden hablar con el mismo estado global gracias al contexto. */}
      <ProductList />
      <CartSummary />

    </CartProvider>
  );
}

export default EcommerceWithContext;

