// 1. Importamos la función useState del paquete de React.
// Esta función es lo que nos permite añadir "estado" o "memoria" a un componente.
import { useState } from 'react';
import VideoList from './VideoList.jsx';

// 2. Definimos el componente funcional 'SearchableVideoList'.
// Este componente recibe la prop 'videos', que es un array con todos los videos disponibles.
function SearchableVideoList({ videos }) {

  // 3. Aquí usamos useState. Le pedimos a React una "cajita de memoria"
  // para guardar el texto que el usuario escribe en la barra de búsqueda.
  // El valor inicial es una cadena vacía ('').
  // useState nos devuelve dos cosas en un array:
  // - searchText: La variable que guarda el valor actual de la memoria.
  // - setSearchText: La función que usaremos para actualizar ese valor y avisarle a React que cambie la interfaz.
   // Cuando usas useState y luego llamas a la función que actualiza el estado (setSearchText en este caso), le estás diciendo a React que vuelva a renderizar el componente con el nuevo valor.
  const [searchText, setSearchText] = useState('');
  // así se declara una estado y su setter x defecto
  const [btnText, setBtnText] = useState('Buscar');
  const [onoff, setOnOff] = useState(false);

  // 4. Llamamos a una función 'filterVideos' (que asumimos que está definida en otro lugar).
  // Esta función filtra el array original de 'videos' usando el texto de búsqueda actual (searchText).
  // El resultado se guarda en la variable 'foundVideos'.
  const foundVideos = filterVideos(videos, searchText);

  // 5. El componente retorna la interfaz de usuario que se mostrará en la pantalla.
  return (
    // <> y </> son "Fragmentos" de React. Nos permiten agrupar elementos
    // sin añadir un div extra al DOM.
    <>
      {/* // 6. Usamos un componente 'SearchInput' (barra de búsqueda).
      // - Le pasamos el valor actual del estado (searchText) para que el campo de texto se muestre correctamente. */}
      <SearchInput
        value={searchText}
        // - Con 'onChange', le decimos qué hacer cuando el usuario escribe.
        // - Cuando el texto cambia, llamamos a setSearchText() para actualizar el estado
        // con el nuevo texto (newText). Esto provoca que el componente se vuelva a renderizar.
        onChange={newText => setSearchText(newText)} />
        
      {/* // 7. Usamos el componente 'VideoList' que ya conocemos.
      // - Le pasamos el array filtrado 'foundVideos' para que solo muestre los videos que coinciden. */}
      <VideoList
        videos={foundVideos}
        // - Le pasamos un encabezado dinámico que muestra el texto de búsqueda cuando no hay resultados.
        emptyHeading={`No matches for “${searchText}”`} />
    </>
  );
}