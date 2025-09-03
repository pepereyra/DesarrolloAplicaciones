// Simulación de los datos de los videos que normalmente vendrían de una API
const videos = [
    { id: 1, title: 'Video 1', url: 'https://youtube.com/video1', description: 'Descripción del video 1' },
    { id: 2, title: 'Video 2', url: 'https://youtube.com/video2', description: 'Descripción del video 2' },
    { id: 3, title: 'Video 3', url: 'https://youtube.com/video3', description: 'Descripción del video 3' },
];

const emptyHeading = "No hay videos disponibles";

// Función que crea el elemento HTML para un solo video
function crearVideoElemento(video) {
    const div = document.createElement('div');
    // Nota: Aquí necesitaríamos lógica para el 'Thumbnail' y el 'LikeButton',
    // que requerirían más funciones y elementos HTML.
    
    const h3 = document.createElement('h3');
    h3.textContent = video.title;

    const p = document.createElement('p');
    p.textContent = video.description;

    const a = document.createElement('a');
    a.href = video.url;
    a.appendChild(h3);
    a.appendChild(p);
    
    div.appendChild(a);

    return div;
}

// Función principal que genera toda la lista
function VideoList(videos, emptyHeading) {
    const count = videos.length;
    let heading;
    if (count > 0) {
        const noun = count > 1 ? 'Videos' : 'Video';
        heading = count + ' ' + noun;
    } else {
        heading = emptyHeading;
    }

    // Selecciona el contenedor del HTML
    const container = document.getElementById('video-list-container');

    // Crea el título de la sección
    const headingElement = document.createElement('h2');
    headingElement.textContent = heading;
    container.appendChild(headingElement);

    // Itera sobre el array de videos para crear cada elemento
    videos.forEach(video => {
        const videoElement = crearVideoElemento(video);
        container.appendChild(videoElement);
    });
}

// Llama a la función para renderizar la lista
VideoList(videos, emptyHeading);