document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const videoListContainer = document.getElementById('videoListContainer');
    const initialVideos = [
        { id: 1, title: 'Gatos Graciosos' },
        { id: 2, title: 'Aprende JavaScript' },
        { id: 3, title: 'Recetas Fáciles' },
        { id: 4, title: 'Guía de HTML y CSS' },
        { id: 5, title: 'Programación en Python' },
    ];

    let currentVideos = initialVideos;

    function filterVideos(videos, searchText) {
        if (!searchText) {
            return videos;
        }
        const lowerSearchText = searchText.toLowerCase();
        return videos.filter(video =>
            video.title.toLowerCase().includes(lowerSearchText)
        );
    }

    function renderVideoList(videos, emptyHeading) {
        videoListContainer.innerHTML = ''; // Limpiar la lista anterior
        if (videos.length === 0) {
            const emptyMessage = document.createElement('h3');
            emptyMessage.textContent = emptyHeading;
            videoListContainer.appendChild(emptyMessage);
            return;
        }

        const ul = document.createElement('ul');
        videos.forEach(video => {
            const li = document.createElement('li');
            li.textContent = video.title;
            ul.appendChild(li);
        });
        videoListContainer.appendChild(ul);
    }

    // Renderizar la lista inicial de videos
    renderVideoList(currentVideos, 'No hay videos disponibles.');

    // Escuchar los cambios en el input de búsqueda
    searchInput.addEventListener('input', (event) => {
        const searchText = event.target.value;
        const foundVideos = filterVideos(initialVideos, searchText);
        renderVideoList(foundVideos, `No hay coincidencias para “${searchText}”`);
        currentVideos = foundVideos; // Actualizar la lista actual
    });
});