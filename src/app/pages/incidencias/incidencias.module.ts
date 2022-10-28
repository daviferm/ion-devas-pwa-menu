import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidenciasPageRoutingModule } from './incidencias-routing.module';
import { ComponentesModule } from '../../componentes/componentes.module';

import { IncidenciasPage } from './incidencias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncidenciasPageRoutingModule,
    ComponentesModule
  ],
  declarations: [IncidenciasPage]
})
export class IncidenciasPageModule {}
