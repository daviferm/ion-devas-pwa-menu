import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GoogleMapsModule } from '@angular/google-maps';

import { MapaComponent } from './mapa/mapa.component'
import { NavbarComponent } from './navbar/navbar.component';
import { SearchMapComponent } from './search-map/search-map.component';
import { PipesModule } from '../pipes/pipes.module';
import { DetallesModalComponent } from './detalles-modal/detalles-modal.component';
import { UploadImgComponent } from './upload-img/upload-img.component';

import { AlifeFileToBase64Module } from 'alife-file-to-base64';


@NgModule({
  declarations: [
    MapaComponent,
    NavbarComponent,
    SearchMapComponent,
    DetallesModalComponent,
    UploadImgComponent
  ],
  exports: [
    MapaComponent,
    NavbarComponent,
    SearchMapComponent,
    DetallesModalComponent,
    UploadImgComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    GoogleMapsModule,
    PipesModule,
    AlifeFileToBase64Module
  ]
})
export class ComponentesModule { }
