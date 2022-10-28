import { Component, OnInit } from '@angular/core';
import { MapPolygonService } from '../../services/map-polygon.service';
import { LayerBarrio } from '../../interfaces/markers.interface';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {

  options: google.maps.MapOptions = {
    center: {lat: 40.459706, lng: -3.6899817},
    zoom: 12.5,
    disableDefaultUI: true,
    gestureHandling: 'greedy',
    rotateControl: true
  };
  vertices: LayerBarrio[];

  // polyOptions: google.maps.PolygonOptions= {
  //   strokeWeight: .5,
  //   fillColor: '#5cc9f5',
  // }

  constructor( public polygonService: MapPolygonService ) {
    this.vertices = this.polygonService.barriosLayers;
   }

  ngOnInit() {
  }

  polygonClick( e: LayerBarrio, idx: number ) {
    console.log(e);
    e.options.fillColor = 'orange';
  }

  mapClick( e ) {
    console.log(e);
  }

}
