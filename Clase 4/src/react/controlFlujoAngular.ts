import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-example',
  template: `{{message}}`
})
export class ExampleComponent implements OnInit, OnChanges, AfterViewInit {
  message = '';

  // 1. Angular llama AUTOMÁTICAMENTE ngOnChanges si hay @Input()
  ngOnChanges() {
    console.log('ngOnChanges: Inputs cambiaron');
  }

  // 2. Angular llama ngOnInit UNA VEZ después de inicializar el componente
  ngOnInit() {
    this.message = 'Hola desde ngOnInit';
    console.log('ngOnInit: Componente listo');
  }

  // 3. Angular llama ngAfterViewInit después de renderizar la vista
  ngAfterViewInit() {
    console.log('ngAfterViewInit: Vista renderizada');
  }
}