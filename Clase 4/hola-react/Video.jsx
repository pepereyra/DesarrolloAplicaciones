import React from 'react';


// Definimos un componente funcional en React llamado 'Video'.
// Recibe un único parámetro, 'video', que es un objeto con la información de un video.
function Video({ video }) {
  
  // El 'return' es lo que el componente va a renderizar o dibujar en la pantalla.
  return (
    
    // Este 'div' actúa como un contenedor principal para organizar todos los elementos del video.
    <div>
      
      {/* // Aquí usamos otro componente llamado 'Thumbnail'.
      // Le pasamos todo el objeto 'video' como una propiedad para que sepa qué miniatura mostrar. */}
      <Thumbnail video={video} />
      
      
      
      {/* // Creamos un enlace <a> que envuelve el título y la descripción del video.
      // La URL del enlace se toma directamente de la propiedad 'video.url'. */}
      <a href={video.url}>
        
        {/* // El título del video se muestra dentro de una etiqueta <h3>.
        // Usamos llaves {} para insertar el valor de la propiedad 'video.title' en el HTML. */}
        <h3>{video.title}</h3>
        
        {/* // La descripción del video se muestra en una etiqueta <p>.
        // De nuevo, usamos llaves para insertar el valor de 'video.description'. */}
        <p>{video.description}</p>
        
      </a>
      
      {/* // Incluimos otro componente, el 'LikeButton' (botón de me gusta).
      // También le pasamos el objeto 'video' para que pueda manejar la lógica de "Me gusta" para ese video en particular. */}
      <LikeButton video={video} />
      
    </div>
  );
}

export default Video;