console.log("Paso 1"); // Síncrono (se ejecuta inmediatamente)

// setTimeout(() => {console.log("Paso 2");}, 1000);
  
// Asíncrono (se ejecuta después)
// setTimeout(function, delay)
setTimeout(() => {console.log("Paso 2");}, 1000);

console.log("Paso 3"); // Síncrono (no espera al setTimeout)


// fetch permite solicitar recursos de una API o servidor de manera asíncrona

// fetch Hace una solicitud GET (por defecto) a la URL especificada.
fetch('https://api.example.com/data')
// response contiene la respuesta HTTP
// response.json() convierte la respuesta en formato JSON a un objeto JavaScript.
  .then(response => response.json())
// data es el resultado de response.json() (ya convertido a objeto/array JS).
// Aquí puedes manipular los datos, mostrarlos o guardarlos en una variable.  
  .then(data => console.log(data))
// Si hay un error, error contiene información sobre el problema
  .catch(error => console.error(error));


// async/await es una forma más limpia de trabajar evitando el anidamiento de .then().

// Declaración de una función asíncrona llamada getData
async function getData() {
  
  // try/catch Si ocurre un error dentro de este bloque, salta al catch.
  try {
    
    // 1. Hacemos una petición HTTP GET a la URL 
    // await JavaScript puede seguir ejecutando otras tareas hasta que llegue la respuesta
    // El resultado se guarda en response 
    const response = await fetch('https://api.example.com/data');
    
    // 2. Convertimos la respuesta a formato JSON
    // await espera a que se complete la conversión a json
    const data = await response.json();
    
    // 3. Mostramos los datos en la consola
    console.log(data);
    
  } catch (error) {
    // 4. Manejo de errores: captura cualquier error que ocurra
    console.error(error);
  }
}