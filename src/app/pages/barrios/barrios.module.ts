import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BarriosPageRoutingModule } from './barrios-routing.module';

import { BarriosPage } from './barrios.page';
import { ComponentesModule } from '../../componentes/componentes.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BarriosPageRoutingModule,
    ComponentesModule,
    PipesModule
  ],
  declarations: [BarriosPage]
})
export class BarriosPageModule {}
