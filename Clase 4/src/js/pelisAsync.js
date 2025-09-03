const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTJjYTAwZDYxZWIzOTEyYjZlNzc4MDA4YWQ3ZmNjOCIsInN1YiI6IjYyODJmNmYwMTQ5NTY1MDA2NmI1NjlhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4MJSPDJhhpbHHJyNYBtH_uCZh4o0e3xGhZpcBIDy-Y8'
    }
  };
  
  // Función principal con async/await
  async function getPelis() {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated`, options);
      
      // Verifica si la respuesta es exitosa (status 200-299)
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      renderPelis(data);
    } catch (error) {
      dibujarError(error);
    }
  }
  
  // Función para renderizar películas (igual que tu versión original)
  function renderPelis(data) {
    const peliculas = data.results;
    let rows = '';
    
    for(let peli of peliculas) {
      rows += `
      <tr>
          <td>${peli.title}</td>
          <td>${peli.release_date}</td>
          <td>${peli.vote_average}</td>
          <td>
              <img src="https://image.tmdb.org/t/p/w500/${peli.poster_path}" class="img-fluid w-25">
          </td>
      </tr>
      `;
    }
    
    document.querySelector("#peliculas").innerHTML = rows;
  }
  
  // Función para manejar errores (debes implementarla)
  function dibujarError(error) {
    console.error("Error al obtener películas:", error);
    document.querySelector("#peliculas").innerHTML = `
      <tr>
        <td colspan="4" class="text-danger">Error al cargar los datos: ${error.message}</td>
      </tr>
    `;
  }
  
  // Llamar a la función
  getPelis();