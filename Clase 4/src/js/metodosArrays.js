// ========== MÉTODOS BÁSICOS ========== //

// 1. push() - Añadir elemento al final
let frutas = ["manzana", "pera"];
frutas.push("limon"); // ["manzana", "pera", "limon"]

// 2. pop() - Eliminar último elemento
frutas.pop(); // ["manzana", "pera"]



// ========== MÉTODOS DE BÚSQUEDA ========== //

// 5. indexOf() - Encontrar posición
frutas.indexOf("manzana"); // 0

// 6. includes() - Verificar existencia
frutas.includes("manzana"); // true


// ========== MÉTODOS DE TRANSFORMACIÓN ========== //

// 8. map() - Transformar cada elemento, y crea un nuevo array
let numbers = [5, 12, 8, 130];
let numberx2= numbers.map((num) => (num * 2)); // [10, 24, 16, 260]

// map haría algo parecido
// for (let i = 0; i < numbers.length; i++) {
//   multiplicar(numbers[i])
  
// }
// function multiplicar(num) {
//   return num *2;
// }

const usuarios = [
    { id: 1, nombre: "Ana" },
    { id: 2, nombre: "Luis" },
    { id: 3, nombre: "Carlos" },
  ];
  
const nombres = usuarios.map((usuario) => (usuario.nombre)); // ["Ana", "Luis", "Carlos"]


// let numbers = [5, 12, 8, 130];
// 9. filter() - Filtrar elementos
numbers.filter(num => num > 10); // [12, 130]

// 10. reduce() - Reducir a un solo valor
numbers.reduce((total, num) => total + num, 0); // 155


// ========== MÉTODOS DE VERIFICACIÓN ========== //

// 13. every() - ¿Todos cumplen condición?
numbers.every(num => num > 0); // true

// 14. some() - ¿Alguno cumple condición?
numbers.some(num => num % 2 === 0); // true

// ========== OTROS MÉTODOS ÚTILES ========== //

// 15. sort() - Ordenar elementos
let random = [3, 1, 4, 2];
random.sort();
random; // [1, 2, 3, 4]

// 16. reverse() - Invertir orden
random.reverse();
random; // [4, 3, 2, 1]

