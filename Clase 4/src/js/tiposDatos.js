// Diferencias de declaración
var nombre = "Carlos";  // Evitar usar var
let edad = 28;
const PI = 3.14;

console.log("nombre ", nombre);
console.log("edad ", edad);
console.log("PI ", PI);

edad = 333;
console.log("Edad: ", edad);

PI = 1
console.log("PI: ", PI);

// Tipos primitivos
let texto = "Hola mundo";
let numero = 42;
let esActivo = true;
let vacio = null;
let indefinido;

let variable;
console.log(variable); // undefined

if (vacio == indefinido) {
    console.log("Son iguales");
}

if (numero > 40) {
    console.log(numero, " es mayor a 40");
}

if (esActivo) {
    console.log("Activo");
}

// Arrays
let frutas = ["manzana", "banana", "uva"];

for (let indice = 0; indice < frutas.length; indice++) {
    console.log(frutas[indice]);
}

frutas.forEach(fruta => {
    console.log(fruta);
});

// Objetos
let persona = {
    nombre: "Lucía",
    edad: 32,
    activa: true
};

console.log(persona.nombre);  // "Lucía"
console.log(persona.edad);    // 32
console.log(persona.activa); // true