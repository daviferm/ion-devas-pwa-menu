import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BarriosPage } from './barrios.page';

const routes: Routes = [
  {
    path: '',
    component: BarriosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarriosPageRoutingModule {}
