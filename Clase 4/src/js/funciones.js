// clásica
function saludar(nombre) {
    return `Hola ${nombre}`;
}
console.log(saludar('Mundo'));


// declaración
const despedir = function (nombre) {
    return `Chau ${nombre}`;
};
console.log(despedir('Mundo'));


// flecha
// function multiplicar(a, b) {
//     return a*b;
// }

const multiplicar = (a, b) => {
    a=a+1
    b=b+1
    return a * b
};

console.log(multiplicar(2, 3));

// Parametros x defecto
function sumar(a = 0, b = 0) {
    return a + b;
}
console.log(sumar(2, 3));
console.log(sumar(1));


// condicionales clásicos
let edad = 20;
if (edad >= 18) {
    console.log("Mayor de edad");
} else {
    console.log("Menor de edad");
}

// condicional ternario
let mensaje = edad >= 18 ? "Mayor" : "Menor";
console.log(mensaje);