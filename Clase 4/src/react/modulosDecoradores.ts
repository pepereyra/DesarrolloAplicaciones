// ----- Módulo OBLIGATORIO (Angular no funciona sin esto) -----
@NgModule({
    declarations: [AppComponent, DataListComponent], // Componentes/Pipes aquí
    imports: [BrowserModule, HttpClientModule],     // Módulos externos
    providers: [DataService],                      // Servicios
    bootstrap: [AppComponent]                       // Componente raíz
  })
  export class AppModule {}
  
  // ----- Componente con decorador OBLIGATORIO -----
  @Component({
    selector: 'app-root',                          // Selector HTML
    templateUrl: './app.component.html',           // Template (obligatorio)
    styleUrls: ['./app.component.css']             // Estilos
  })
  export class AppComponent { /*...*/ }