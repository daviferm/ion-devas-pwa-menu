import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GoogleMapsModule } from '@angular/google-maps';

import { MapaComponent } from './mapa/mapa.component'
import { NavbarComponent } from './navbar/navbar.component';
import { SearchMapComponent } from './search-map/search-map.component';


@NgModule({
  declarations: [
    MapaComponent,
    NavbarComponent,
    SearchMapComponent
  ],
  exports: [
    MapaComponent,
    NavbarComponent,
    SearchMapComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    GoogleMapsModule
  ]
})
export class ComponentesModule { }
