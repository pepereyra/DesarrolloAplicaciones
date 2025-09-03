

if(true) {
    var x = 10;
    let y = 20;
}
console.log(x); // 10 (¡se escapó del bloque!)  
console.log(y); //  Error: "y is not defined" (correcto)  

        
for (let i = 0; i < array.length; i++) {
    const element = array[i];
    
}

// Con `let`
let x = 10;
let x = 20; //  Error: "Identifier 'x' has already been declared"

// Con `var`
var y = 5;
var y = 15; //  (¡Pero sobrescribe sin avisar!)
console.log(y); // 15



// Con `let`
console.log(z); //  Error: "Cannot access 'z' before initialization"
let z = 30;

// Con `var`
console.log(w); // undefined (¡no da error!)
var w = 40;