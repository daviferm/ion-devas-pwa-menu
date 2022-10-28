import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Buscador', url: '/home', icon: 'map' },
    { title: 'Mantenimiento (Barrios)', url: '/barrios', icon: 'extension-puzzle' },
    { title: 'Listas de Tareas', url: '/listas', icon: 'list' },
    { title: 'Incidencias', url: '/incidencias', icon: 'warning' },
    { title: 'Alta Rotación', url: '/alta-rotacion', icon: 'car' },
    { title: 'Soporte', url: '/soporte', icon: 'cog' },
  ];

  constructor() {}
}
