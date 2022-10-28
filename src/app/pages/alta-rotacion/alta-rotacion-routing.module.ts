import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltaRotacionPage } from './alta-rotacion.page';

const routes: Routes = [
  {
    path: '',
    component: AltaRotacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltaRotacionPageRoutingModule {}
