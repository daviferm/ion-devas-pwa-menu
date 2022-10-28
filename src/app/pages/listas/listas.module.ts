import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListasPageRoutingModule } from './listas-routing.module';
import { ComponentesModule } from '../../componentes/componentes.module';

import { ListasPage } from './listas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListasPageRoutingModule,
    ComponentesModule
  ],
  declarations: [ListasPage]
})
export class ListasPageModule {}
