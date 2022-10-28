import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaRotacionPageRoutingModule } from './alta-rotacion-routing.module';
import { ComponentesModule } from '../../componentes/componentes.module';

import { AltaRotacionPage } from './alta-rotacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltaRotacionPageRoutingModule,
    ComponentesModule
  ],
  declarations: [AltaRotacionPage]
})
export class AltaRotacionPageModule {}
