import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'barrios',
    loadChildren: () => import('./pages/barrios/barrios.module').then( m => m.BarriosPageModule)
  },
  {
    path: 'listas',
    loadChildren: () => import('./pages/listas/listas.module').then( m => m.ListasPageModule)
  },
  {
    path: 'incidencias',
    loadChildren: () => import('./pages/incidencias/incidencias.module').then( m => m.IncidenciasPageModule)
  },
  {
    path: 'alta-rotacion',
    loadChildren: () => import('./pages/alta-rotacion/alta-rotacion.module').then( m => m.AltaRotacionPageModule)
  },
  {
    path: 'soporte',
    loadChildren: () => import('./pages/soporte/soporte.module').then( m => m.SoportePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
