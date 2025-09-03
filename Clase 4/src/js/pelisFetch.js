const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTJjYTAwZDYxZWIzOTEyYjZlNzc4MDA4YWQ3ZmNjOCIsInN1YiI6IjYyODJmNmYwMTQ5NTY1MDA2NmI1NjlhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4MJSPDJhhpbHHJyNYBtH_uCZh4o0e3xGhZpcBIDy-Y8'
    }
  };

function getPelis() {
    const respuesta = fetch(`https://api.themoviedb.org/3/movie/top_rated`,options);

    respuesta
        .then(response => response.json())
        .then(data => renderPelis(data))//fulfilled
        .catch(error => dibujarError(error))//rejected
}

function renderPelis(data) {
    const peliculas = data.results;
    let rows = '';
    for(let peli of peliculas) {
        rows += `
        <tr>
            <td>${peli.title}</th>
            <td>${peli.release_date}</td>
            <td>${peli.vote_average}</td>
            <td>
                <img src="https://image.tmdb.org/t/p/w500/${peli.poster_path}" class="img-fluid w-25">
            </td>
        </tr>
        `
    }
    document.querySelector("#peliculas").innerHTML=rows
}