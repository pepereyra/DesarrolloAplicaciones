// Importamos React y los hooks que vamos a utilizar: useState y useEffect.
import React, { useState, useEffect } from 'react';

// Definimos un componente funcional llamado ListaDeProductos.
function ListaDeProductos() {
  // CASO DE USO: MANEJAR DATOS DE UNA API

  // 1. Definimos los estados que necesitará nuestro componente.

  // 'productos' guardará la lista de productos que recibamos de la API.
  // Inicializa como un array vacío porque esperamos una lista.
  const [productos, setProductos] = useState([]);

  // 'cargando' nos ayudará a mostrar un mensaje mientras se obtienen los datos.
  // Inicializa en 'true' porque al montar el componente, empezamos a cargar.
  const [cargando, setCargando] = useState(true);

  // 'error' guardará cualquier error que ocurra durante la llamada a la API.
  // Inicializa en 'null' porque al principio no hay errores.
  const [error, setError] = useState(null);

  // 2. Usamos el hook useEffect para ejecutar código después de que el componente se renderice.
  // Este es el lugar ideal para hacer llamadas a APIs, suscripciones, etc.
  useEffect(() => {
    // La función que pasamos a useEffect se ejecutará después del primer renderizado.

    // Definimos una función asíncrona para poder usar 'await' con fetch.
    const obtenerProductos = async () => {
      try {
        // Hacemos la petición a la API de nuestro json-server.
        const respuesta = await fetch('http://localhost:3000/productos');

        // Si la respuesta no es exitosa (ej: error 404 o 500), lanzamos un error.
        if (!respuesta.ok) {
          throw new Error('Error al obtener los datos de los productos.');
        }

        // Convertimos la respuesta a formato JSON.
        const data = await respuesta.json();

        // Actualizamos el estado 'productos' con los datos recibidos.
        setProductos(data);
      } catch (err) {
        // Si ocurre cualquier error en el bloque 'try', lo capturamos aquí.
        // Actualizamos el estado 'error' con el mensaje del error.
        setError(err.message);
      } finally {
        // El bloque 'finally' se ejecuta siempre, tanto si hubo éxito como si hubo error.
        // Dejamos de mostrar el mensaje de "cargando".
        setCargando(false);
      }
    };

    // Llamamos a la función que acabamos de definir.
    obtenerProductos();

  // 3. El array de dependencias vacío `[]` es MUY IMPORTANTE.
  // Significa que el efecto se ejecutará SOLAMENTE UNA VEZ, justo después de que se renderiza el componente
  // Si no lo pusiéramos, el efecto se ejecutaría en cada re-renderizado, creando un bucle infinito.
  }, []);

  // 4. Renderizamos la UI basándonos en el estado actual.

  // Si 'cargando' es true, mostramos un mensaje de carga.
  if (cargando) {
    return <div>Cargando productos...</div>;
  }

  // Si hay un 'error', mostramos el mensaje de error.
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Si todo fue bien, mostramos la lista de productos.
  return (
    <div>
      <h1>Lista de Productos</h1>
      <ul>
        {/* Mapeamos el array de 'productos' para renderizar un <li> por cada uno. */}
        {productos.map(producto => (
          <li style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} key={producto.id}>
            {producto.nombre} - ${producto.precio}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Exportamos el componente para poder usarlo en otros archivos.
export default ListaDeProductos;