// Importamos React y el hook useState para poder usar estado en el componente.
import React, { useState } from 'react';

// Definimos el componente funcional FollowButton.
function FollowButton() {
  // 1. INICIALIZACIÓN DEL ESTADO
  // Usamos useState para crear una variable de estado llamada 'isFollowing'.
  // Su valor inicial es 'false', lo que significa que al principio no se está siguiendo.
  // 'setIsFollowing' es la función que usaremos para cambiar el valor de 'isFollowing'.
  const [isFollowing, setIsFollowing] = useState(false);

  // 2. LÓGICA CONDICIONAL BASADA EN EL ESTADO
  // Determinamos el texto del botón basándonos en el valor de 'isFollowing'.
  // Si 'isFollowing' es true, el texto será 'Dejar de Seguir'. Si es false, será 'Seguir'.
  const text = isFollowing ? 'Dejar de Seguir' : 'Seguir';

  // Determinamos el estilo del botón.
  // Si 'isFollowing' es true, el color será rojo. Si es false, será verde.
  const buttonStyles = {
    backgroundColor: isFollowing ? '#dc3545' : '#28a745', // Rojo para "Dejar de Seguir", Verde para "Seguir"
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '9999px', // Para hacerlo redondeado como el de Twitter
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease' // Añadimos una transición suave
  };

  // 3. MANEJADOR DE EVENTOS
  // Esta función se llamará cada vez que el usuario haga clic en el botón.
  const handleClick = () => {
    // Usamos la función 'setIsFollowing' para actualizar el estado.
    // Le pasamos el valor contrario al actual (!isFollowing).
    // Si era 'false', se convertirá en 'true', y viceversa.
    // React volverá a renderizar el componente con el nuevo estado.
    setIsFollowing(!isFollowing);
  };

  // 4. RENDERIZADO DEL COMPONENTE
  // Devolvemos el elemento JSX que se mostrará en la pantalla.
  return (
    <button onClick={handleClick} style={buttonStyles}>
      {text}
    </button>
  );
}

// Exportamos el componente para que pueda ser usado en otras partes de la aplicación.
export default FollowButton;