import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' }) // Decorador OBLIGATORIO
export class DataService {
  getData() { return ['A', 'B', 'C']; }
}

// ----- Componente que usa el servicio -----
@Component({
  selector: 'app-data-list',
  template: `<div *ngFor="let item of data">{{item}}</div>`
})
export class DataListComponent {
  data: string[];

  // Angular INYECTA el servicio aquí. No puedes hacer `new DataService()`
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.data = this.dataService.getData(); // Usa el servicio inyectado
  }
}