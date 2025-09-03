// Importamos React y los hooks necesarios.
import React, { useState, useEffect } from 'react';
// Importamos nuestro custom hook 'useCart' para acceder al contexto del carrito.
import { useCart } from './CartContext.jsx';

// --- COMPONENTE CONSUMIDOR: LISTA DE PRODUCTOS ---
// Este componente es responsable únicamente de mostrar la lista de productos.
function ProductList() {
  // Usamos el hook 'useCart' para obtener la función 'addToCart' del contexto.
  // Ya no necesitamos `useContext` directamente, lo que hace el código más limpio.
  const { addToCart } = useCart();

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

// Exportamos el componente para que pueda ser usado en otras partes de la aplicación.
export default ProductList;