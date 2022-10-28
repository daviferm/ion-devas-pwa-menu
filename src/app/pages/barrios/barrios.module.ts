import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BarriosPageRoutingModule } from './barrios-routing.module';

import { BarriosPage } from './barrios.page';
import { ComponentesModule } from '../../componentes/componentes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BarriosPageRoutingModule,
    ComponentesModule
  ],
  declarations: [BarriosPage]
})
export class BarriosPageModule {}
