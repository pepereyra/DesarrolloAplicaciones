

const boton1 = document.querySelector('#miBoton1');
boton1.onclick = function() {
  alert('Click con propiedad onclick');
};



const boton2 = document.querySelector('#miBoton2');

boton2.addEventListener('click', function(evento) {
  alert('1ra acción addEventListener!', evento.target);
});

boton2.addEventListener('click', function(evento) {
  alert('2da acción addEventListener!', evento.target);
});