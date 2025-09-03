// Importamos React y los hooks que vamos a utilizar.
import React, { useState } from 'react';

// --- Datos de ejemplo (simulando una respuesta de API) ---
const productosIniciales = [
  { id: 1, nombre: 'Celular Samsung S23', precio: 1500 },
  { id: 2, nombre: 'Notebook Gamer Asus', precio: 2500 },
  { id: 3, nombre: 'Teclado Mecánico Redragon', precio: 150 },
  { id: 4, nombre: 'Monitor Curvo Samsung 27"', precio: 800 },
];

// --- Componente para una tarjeta de producto individual ---
function TarjetaProducto({ producto, onAgregarAlCarrito }) {
  // CASO DE USO 1: Contador de cantidad para un producto.
  // Cada tarjeta de producto tiene su propio estado de cantidad, independiente de las demás.
  const [cantidad, setCantidad] = useState(1);

  // Función para incrementar la cantidad.
  const incrementar = () => {
    setCantidad(cantidad + 1);
  };

  // Función para decrementar, con un límite de 1.
  const decrementar = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', width: '200px' }}>
      <h4>{producto.nombre}</h4>
      <p>Precio: ${producto.precio}</p>
      <div>
        <button onClick={decrementar}>-</button>
        <span style={{ margin: '0 10px' }}>{cantidad}</span>
        <button onClick={incrementar}>+</button>
      </div>
      <button onClick={() => onAgregarAlCarrito(producto, cantidad)} style={{ marginTop: '10px' }}>
        Agregar al carrito
      </button>
    </div>
  );
}

// --- Componente principal que simula la página de e-commerce ---
function PaginaEcommerce() {
  // CASO DE USO 2: Manejar el término de búsqueda de un input.
  // 'terminoBusqueda' guardará lo que el usuario escribe en la barra de búsqueda.
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // CASO DE USO 3: Manejar una lista de objetos, como un carrito de compras.
  // 'carrito' es un array que contendrá los productos que el usuario agregue.
  const [carrito, setCarrito] = useState([]);

  // CASO DE USO 4: Controlar la visibilidad de un elemento (como el carrito).
  // 'mostrarCarrito' es un booleano que usaremos para mostrar u ocultar el resumen del carrito.
  const [mostrarCarrito, setMostrarCarrito] = useState(true);

  // Función para manejar los cambios en el input de búsqueda.
  const handleBusqueda = (event) => {
    // Actualizamos el estado 'terminoBusqueda' con el valor del input.
    setTerminoBusqueda(event.target.value);
  };

  // Función para agregar un producto y su cantidad al carrito.
  const agregarAlCarrito = (producto, cantidad) => {
    // Actualizamos el estado 'carrito'.
    // Usamos el operador "spread" (...) para crear una nueva copia del array
    // y le añadimos el nuevo producto. React necesita un nuevo array para detectar el cambio.
    setCarrito([...carrito, { ...producto, cantidad }]);
    alert(`${cantidad} x ${producto.nombre} agregado(s) al carrito!`);
  };

  // Filtramos los productos basándonos en el término de búsqueda.
  const productosFiltrados = productosIniciales.filter((p) =>
    p.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div>
      <h1>Tienda de Ejemplo - Mercado Libre</h1>

      {/* --- Barra de Búsqueda --- */}
      <input
        type="text"
        placeholder="Buscar productos..."
        value={terminoBusqueda} // El valor del input está ligado al estado.
        onChange={handleBusqueda} // La función se llama en cada cambio.
        style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
      />

      {/* --- Lista de Productos --- */}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {productosFiltrados.map((producto) => (
          <TarjetaProducto
            key={producto.id}
            producto={producto}
            onAgregarAlCarrito={agregarAlCarrito}
          />
        ))}
      </div>

      {/* --- Carrito de Compras --- */}
      <div style={{ marginTop: '30px', borderTop: '2px solid black' }}>
        <h2>
          Resumen del Carrito ({carrito.length} items)
          {/* Botón para mostrar/ocultar el detalle del carrito */}
          <button onClick={() => setMostrarCarrito(!mostrarCarrito)} style={{ marginLeft: '10px' }}>
            {mostrarCarrito ? 'Ocultar' : 'Mostrar'}
          </button>
        </h2>
        {/* Renderizado condicional basado en el estado 'mostrarCarrito' */}
        {mostrarCarrito && (
          <ul>
            {carrito.map((item, index) => (
              <li key={index}>{item.cantidad} x {item.nombre} - ${item.precio * item.cantidad}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PaginaEcommerce;