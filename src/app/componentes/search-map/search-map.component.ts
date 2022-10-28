import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LayerBarrio } from 'src/app/interfaces/markers.interface';
import { Parquimetro } from '../../interfaces/markers.interface';
import { Animation } from '@ionic/angular';

@Component({
  selector: 'app-search-map',
  templateUrl: './search-map.component.html',
  styleUrls: ['./search-map.component.scss'],
})
export class SearchMapComponent implements OnInit {

  @Output() closeMap: EventEmitter<boolean> = new EventEmitter();
  @Input() marcador: Parquimetro;
  @Input() polygon: LayerBarrio;
  imgIcon: string = 'assets/img/parkeon.png';

  options: google.maps.MapOptions = {
    zoom: 15,
    disableDefaultUI: true,
    gestureHandling: 'greedy',
    rotateControl: true
  };
  markerOptions: google.maps.MarkerOptions = {
    icon: this.imgIcon
    // animation: DROP
  }
  vertices: LayerBarrio[];


  constructor() { }

  ngOnInit() {
  }

  mapClick( e ) {
    console.log(e);
  }

  polygonClick( e: LayerBarrio ) {
    console.log(e);
  }
  cerrarMapa() {
    this.closeMap.emit( true );
  }



}
