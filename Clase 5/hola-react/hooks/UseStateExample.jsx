// Importamos 'React' para poder usar JSX y las funcionalidades de la librería.
import React, { useState } from 'react'; // Importamos el hook 'useState' desde React. Este hook nos permite añadir estado a nuestros componentes funcionales.

// Definimos un componente funcional de React llamado 'Contador'.
function Contador() {
  // Aquí es donde usamos el hook 'useState'.
  // 'useState(0)' inicializa una variable de estado. El '0' que pasamos como argumento es el valor inicial.
  // 'useState' devuelve un array con dos elementos que extraemos usando desestructuración:
  // 1. 'contador': Es la variable que contiene el valor actual del estado (inicialmente será 0).
  // 2. 'setContador': Es la función que usaremos para actualizar el valor de 'contador'.
  const [contador, setContador] = useState(0);
  const [camera, setCamera] = useState(false);

  const toggleCamera = () => {
    setCamera(!camera);
  };

  
  // Esta es la función que se ejecutará cuando el usuario haga clic en el botón.
  const incrementarContador = () => {
    // Llamamos a la función 'setContador' para actualizar el estado.
    // Le pasamos el nuevo valor que queremos que tenga la variable 'contador'.
    // En este caso, es el valor actual de 'contador' más 1.
    // ¡Importante! Cuando 'setContador' es llamada, React sabe que el estado ha cambiado
    // y volverá a renderizar (dibujar) este componente 'Contador' en la pantalla,
    // pero esta vez con el nuevo valor de 'contador'.
    setContador(contador + 1);
  };

  // El componente devuelve el código JSX que se mostrará en la pantalla.
  return (
    <div style={{ border: '1px solid black', padding: '10px', borderRadius: '5px' }}> {/* Un div contenedor para nuestros elementos. */}
      {/* Mostramos el valor actual de nuestra variable de estado 'contador' dentro de una etiqueta <p>. */}
      <p>Contador: {contador}</p>
      {/* Creamos un botón. Cuando se hace clic en él (evento onClick), se llama a la función 'incrementarContador'. */}
      <button onClick={incrementarContador}>Haz clic para incrementar</button>
      <div>
        <div style={{ marginTop: '10px', background: camera ? 'lightgreen' : 'lightcoral', padding: '5px', borderRadius: '5px' }}>
          Cámara: {camera ? 'on' : 'off'}
        </div>
        <button onClick={toggleCamera}>Toggle Cámara</button>
      </div>

    </div>

  );
}

// Exportamos el componente 'Contador' para que pueda ser utilizado en otros archivos de nuestra aplicación.
export default Contador;
