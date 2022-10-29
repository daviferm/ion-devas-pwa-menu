import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgFabricantePipe } from './img-fabricante.pipe';
import { ContarItemsPipe } from './contar-items.pipe';



@NgModule({
  declarations: [
    ImgFabricantePipe,
    ContarItemsPipe
  ],
  exports: [
    ImgFabricantePipe,
    ContarItemsPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
