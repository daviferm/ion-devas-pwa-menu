import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgFabricantePipe } from './img-fabricante.pipe';
import { ContarItemsPipe } from './contar-items.pipe';
import { TarifaPipe } from './tarifa.pipe';



@NgModule({
  declarations: [
    ImgFabricantePipe,
    ContarItemsPipe,
    TarifaPipe
  ],
  exports: [
    ImgFabricantePipe,
    ContarItemsPipe,
    TarifaPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
