import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SoportePageRoutingModule } from './soporte-routing.module';
import { ComponentesModule } from '../../componentes/componentes.module';

import { SoportePage } from './soporte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SoportePageRoutingModule,
    ComponentesModule
  ],
  declarations: [SoportePage]
})
export class SoportePageModule {}
