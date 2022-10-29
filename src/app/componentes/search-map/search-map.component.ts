import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Parquimetro, LayerBarrio } from 'src/app/interfaces/markers.interface';
import { DataFormService } from '../../services/data-form.service';
import { ListaInteface, IncidenciaInteface } from '../../interfaces/markers.interface';
import { Subject, Subscription } from 'rxjs';
import { GestionRutasService } from '../../services/gestion-rutas.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-search-map',
  templateUrl: './search-map.component.html',
  styleUrls: ['./search-map.component.scss'],
})
export class SearchMapComponent implements OnInit {

  @Output() closeMap: EventEmitter<boolean> = new EventEmitter();
  @Output() itemEliminado: EventEmitter<ListaInteface> = new EventEmitter();
  @Input() latitud: number;
  @Input() longitud: number;
  @Input() zoom: number = 12.5;
  @Input() markers: Parquimetro[] = [];
  @Input() marker: Parquimetro;
  @Input() itemSoporte: Parquimetro;
  @Input() marcadores: Parquimetro[] = [];
  @Input() barriosSelec: LayerBarrio[];
  @Input() barrioPolygon: LayerBarrio;
  @Input() incidenciasList: IncidenciaInteface[];
  @Input() tarea: ListaInteface;
  @Input() pagina: string;

  tareaTitle: string;
  infoMarker: Parquimetro;
  infoWindow: boolean = true;
  modalTop: boolean;
  textInfo = { barrio: '', numero: 0 };
  idxBarrioSelected: number;
  openModal: boolean = false;
  latGps: number;
  lngGps: number;
  gps = false;
  siguiendo: boolean = false;
  $subscription: Subscription;
  $obsLocation: Subject<unknown>;
  $obsGps: Subscription;
  $obsCenterGps: Subscription;
  imgPosition = 'assets/img/marker-car.png';
  imgMarcadores = 'assets/img/icono-position.png';

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
    // icon: this.imgIcon
    // animation: DROP
  }
  vertices: LayerBarrio[];


  constructor( private dataFormService: DataFormService,
               private gestionRutasService: GestionRutasService,
               private storage: StorageService ) { }

  ngOnInit() {
    // console.log(navigator.userAgent);
  }
  isMobileIphone(){
    return (
      (navigator.userAgent.match(/iPhone/i)) ||
      (navigator.userAgent.match(/iPod/i)) ||
      (navigator.userAgent.match(/iPad/i))
    );
}

  abrirModalIncidencia( incidencia: IncidenciaInteface ) {
    this.infoMarker = incidencia.item;
    this.tareaTitle = incidencia.titulo;
    this.openModal = true;
  }
  abrirModal( marker: Parquimetro ) {
    this.infoMarker = marker;
    this.tareaTitle = this.tarea.titulo;
    this.openModal = true;
  }


  mostrarInfo( marker ) {
    console.log('Información: ', marker);
  }

  // =================================================
  // Realiza una tarea en función de la ruta
  // =================================================
  tareaRealizada( marker: Parquimetro ) {
    const ruta = this.gestionRutasService.pageActive;
    switch (ruta) {
      case 'barrios':
        if ( !marker.hecho ) {
          this.infoMarker.hecho = true;
          this.infoMarker.opacidad = 0.5;
        } else {
          this.infoMarker.hecho = false;
          this.infoMarker.opacidad = 1;
        }
        this.openModal = false;
        break;
      case 'listas':
        const idx = this.marcadores.findIndex( item => item.alias === marker.alias );
        this.marcadores.splice(idx, 1);
        this.openModal = false;
        // Enviar tarea actualizada a página Listas
        this.itemEliminado.emit( this.tarea );

        break;
      case 'incidencias':
        const index = this.incidenciasList.findIndex( item => item.localId === marker.id );
        this.incidenciasList.splice( index, 1 );
        this.storage.setStorage('lista-incidencias', this.incidenciasList);
        this.openModal = false;
        break;
    }
  }



  polygonClick() {
    this.barrioPolygon.options.fillColor = 'green';
    const numBarrio = this.barrioPolygon.id.substring(0, 3);
    const barrio = this.dataFormService.obtenerNumeroParkimetros(numBarrio);
    this.textInfo.numero = barrio;
    this.textInfo.barrio = this.barrioPolygon.id;
    this.modalTop = true;
    // this.idxBarrioSelected = idx;
  }

  outPolygon() {
    this.barrioPolygon.options.fillColor = 'orange';
    this.modalTop = false;
  }

  cerrarMapa() {
    this.closeMap.emit( true );
  }

  seguirPosition() {
    // if ( this.siguiendo ) {
    //   this.$obsCenterGps.unsubscribe();
    // } else {
    //   this.$obsCenterGps = this.$obsLocation.subscribe( ( data: Geoposition ) => {
    //       this.latitud = data.coords.latitude;
    //       this.longitud = data.coords.longitude;
    //     } )
    // }
    // this.siguiendo = !this.siguiendo;
  }

  cerrarModalInfo( event: boolean ) {
    if ( event ) {
      this.openModal = false;
    }
  }
  comoLlegar( marker: Parquimetro, mapa: string ) {
    // if ( mapa === 'google' ) {
    //   this.iab.create(`https://maps.google.com/?q=${marker.latitud},${marker.longitud}`);
    // } else if ( mapa === 'apple' ) {
    //   this.iab.create(`maps://maps.google.com/maps?daddr=${marker.latitud},${marker.longitud}&amp;ll=`);
    // } else {
    //   this.iab.create(`https://www.waze.com/ul?ll=${marker.latitud}%2C${marker.longitud}&navigate=yes&zoom=17`);
    // }
  }

  dragStart( event ) {
    this.infoWindow = false;
  }



}
