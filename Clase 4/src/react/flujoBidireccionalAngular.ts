// Si escribis en el <input> del html, la propiedad nombre se actualiza automáticamente.
// Si cambias nombre en el código ts, el input también se actualiza.
// [(ngModel)] es la sintaxis de two-way binding en Angular.


import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <input [(ngModel)]="nombre" placeholder="Escribe tu nombre">
    <p>Hola, {{ nombre }}!</p>
  `
})
export class AppComponent {
  nombre: string = '';
}