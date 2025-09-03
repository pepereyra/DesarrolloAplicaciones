// Importamos React y los hooks que vamos a utilizar: useState y useEffect.
import React, { useState, useEffect } from 'react';

// Definimos un componente funcional llamado ProductFilter.
function ProductFilter() {
  // --- ESTADOS DEL COMPONENTE ---

  // Estado para almacenar la lista de productos que obtenemos de la API.
  const [productos, setProductos] = useState([]);

  // Estado para manejar la categoría seleccionada. 'Todos' será el valor inicial.
  const [categoria, setCategoria] = useState('Todos');

  // Estado para mostrar un mensaje de "cargando" mientras se hace la petición.
  const [cargando, setCargando] = useState(true);

  // Estado para almacenar cualquier error que ocurra.
  const [error, setError] = useState(null);

  // --- EFECTO SECUNDARIO (useEffect) ---

  // Usamos useEffect para buscar los productos.
  // Este efecto se ejecutará la primera vez que el componente se monte,
  // y luego se volverá a ejecutar CADA VEZ que el valor de 'categoria' cambie.
  useEffect(() => {
    // Definimos la función asíncrona que hará la llamada a la API.
    const obtenerProductosPorCategoria = async () => {
      // Antes de cada nueva búsqueda, reiniciamos los estados.
      setCargando(true);
      setError(null);

      try {
        // Construimos la URL dinámicamente.
        // Si la categoría es 'Todos', traemos todos los productos.
        // Si no, filtramos por la categoría seleccionada usando los query params de json-server.
        const url = categoria === 'Todos'
          ? 'http://localhost:3000/productos'
          : `http://localhost:3000/productos?categoria=${categoria}`;

        // Hacemos la petición a la API.
        const respuesta = await fetch(url);

        // Si la respuesta no es exitosa, lanzamos un error.
        if (!respuesta.ok) {
          throw new Error('Error al obtener los datos de los productos.');
        }

        // Convertimos la respuesta a JSON.
        const data = await respuesta.json();

        // Actualizamos el estado con los nuevos productos.
        setProductos(data);
      } catch (err) {
        // Si hay un error, lo guardamos en el estado.
        setError(err.message);
      } finally {
        // Al final (haya éxito o error), dejamos de cargar.
        setCargando(false);
      }
    };

    // Llamamos a la función para que se ejecute.
    obtenerProductosPorCategoria();

  // 2. ARRAY DE DEPENDENCIAS: [categoria]
  // Este es el punto clave. Al poner 'categoria' aquí, le decimos a React:
  // "Vuelve a ejecutar este efecto si y solo si el valor de la variable 'categoria' ha cambiado".
  }, [categoria]);

  // --- RENDERIZADO DEL COMPONENTE ---

  // Si está cargando, mostramos un mensaje.
  if (cargando) return <div>Cargando productos...</div>;

  // Si hubo un error, lo mostramos.
  if (error) return <div>Error: {error}</div>;

  // Si todo está bien, mostramos los botones de filtro y la lista de productos.
  return (
    <div>
      <h1>Filtro de Productos</h1>
      <div>
        {/* Cada botón actualiza el estado 'categoria', lo que disparará el useEffect. */}
        <button onClick={() => setCategoria('Todos')}>Todos</button>
        <button onClick={() => setCategoria('Anteojos')}>Anteojos</button>
        <button onClick={() => setCategoria('Fotografía')}>Fotografía</button>
        <button onClick={() => setCategoria('Notebooks')}>Notebooks</button>
        <button onClick={() => setCategoria('Tecnología')}>Tecnología</button>
      </div>
      <h2 style={{ marginTop: '20px' }}>Categoría: {categoria}</h2>
      <ul>
        {/* Mapeamos y mostramos los productos filtrados. */}
        {productos.map(producto => (
          <li key={producto.id}>
            {producto.nombre} - ${producto.precio}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductFilter;