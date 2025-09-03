// Importamos las herramientas necesarias de React.
// Se importa 'React' para la funcionalidad base, 'useState' para manejar el estado del carrito,
// 'useContext' para consumir el contexto en otros componentes, y 'createContext' para crear el contexto.
import React, { useState, useContext, createContext } from 'react';

// --- 1. CREACIÓN DEL CONTEXTO ---
// Aquí se crea el "canal" o "túnel" de datos que compartirá la información del carrito.
// Se exporta para que el Provider pueda usarlo.
const CartContext = createContext();

// --- 2. CUSTOM HOOK (Hook Personalizado) para consumir el contexto ---
// Esta función es una abstracción para hacer más fácil y limpio el uso del contexto en otros componentes.
// En lugar de importar `useContext` y `CartContext` en cada componente, solo importarán `useCart`.
export function useCart() {
  // El hook `useContext` se suscribe al `CartContext` y lee su valor actual.
  const context = useContext(CartContext);
  // Esta es una validación de seguridad. Si un componente intenta usar `useCart()` pero no está envuelto por el `CartProvider`, el `context` será `undefined`.  
  // En ese caso, lanzamos un error claro para que el desarrollador sepa qué está mal.
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }

  // Si todo está bien, devolvemos el valor del contexto (que contendrá el estado y las funciones del carrito).
  return context;
}

// --- 3. CREACIÓN DEL PROVEEDOR (PROVIDER) ---
// Este es un componente de React cuya única misión es "proveer" el estado y las funciones del carrito  a todos los componentes hijos que estén envueltos por él.
export function CartProvider({ children }) {
  // Usamos `useState` para crear y manejar el estado del carrito.
  // `cartItems` es la variable que contiene el array de productos. Inicia como un array vacío `[]`.
  // `setCartItems` es la función que usamos para actualizar `cartItems`.
  const [cartItems, setCartItems] = useState([]);

  // Esta es la función que los componentes usarán para agregar un producto al carrito.
  const addToCart = (product) => {
    // Llamamos a la función de actualización del estado.
    // Usamos una función `(prevItems => ...)` para asegurarnos de que estamos trabajando con el estado más reciente.
    // `[...prevItems, product]` crea un NUEVO array, copiando los items anteriores y añadiendo el nuevo.
    // Es crucial no mutar el estado directamente (ej. `prevItems.push(product)`).
    setCartItems(prevItems => [...prevItems, product]);
    // Un mensaje en la consola para confirmar que la acción se realizó.    
    console.log(`${product.nombre} agregado al carrito!`);
  };

  // Creamos un objeto que contiene todo lo que queremos que sea accesible globalmente.
  // En este caso, es el array de items y la función para agregar más.
  const value = { cartItems, addToCart };

  // El componente `CartProvider` renderiza el `Provider` de nuestro contexto.
  // La prop `value` es la más importante: es el objeto que se compartirá con todos los componentes consumidores.
  // `{children}` renderiza cualquier componente que esté anidado dentro de `<CartProvider>`.
  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}