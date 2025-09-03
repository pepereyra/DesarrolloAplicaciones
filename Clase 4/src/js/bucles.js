// Imprimir números del 1 al 5
for (let i = 1; i <= 5; i++) {
    console.log(i); // 1, 2, 3, 4, 5
  }


 // Recorrer un array
let frutas = ["Manzana", "Banana", "Uva"];
for (let fruta of frutas) {
  console.log(fruta); // "Manzana", "Banana", "Uva"
}

// Recorrer un string
let palabra = "Hola";
for (let letra of palabra) {
  console.log(letra); // "H", "o", "l", "a"
}


const persona = { nombre: "Ana", edad: 25 };
for (const clave in persona) {
  console.log(clave + ": " + persona[clave]); 
  // "nombre: Ana", "edad: 25"
}