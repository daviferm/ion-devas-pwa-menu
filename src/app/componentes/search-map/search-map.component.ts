import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Parquimetro, LayerBarrio } from 'src/app/interfaces/markers.interface';
import { ListaInteface, IncidenciaInteface } from '../../interfaces/markers.interface';
import { Observable, Subject, Subscription } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { GestionRutasService } from 'src/app/services/gestion-rutas.service';
import { Browser } from '@capacitor/browser';
import { GeolocationService } from '../../services/geolocation.service';

@Component({
  selector: 'app-search-map',
  templateUrl: './search-map.component.html',
  styleUrls: ['./search-map.component.scss'],
})
export class SearchMapComponent implements OnInit, OnDestroy {

  @Output() closeMap: EventEmitter<boolean> = new EventEmitter();
  @Output() itemEliminado: EventEmitter<ListaInteface> = new EventEmitter();
  @Input() zoom: number = 12.5;
  @Input() markers: Parquimetro[] = [];
  @Input() marker: Parquimetro;
  @Input() centroMapa: {lat: number, lng: number};
  @Input() itemSoporte: Parquimetro;
  @Input() marcadores: Parquimetro[] = [];
  @Input() barriosSelec: LayerBarrio[];
  @Input() barrioPolygon: LayerBarrio;
  @Input() incidenciasList: IncidenciaInteface[];
  @Input() tarea: ListaInteface;
  @Input() pagina: string;

  latGps: number;
  lngGps: number;
  gps = false;
  imgPosition = 'assets/img/marker-car.png';

  tareaTitle: string;
  infoMarker: Parquimetro;
  infoWindow: boolean = true;
  modalTop: boolean;
  textInfo = { barrio: '', numero: 0 };
  openModal: boolean = false;
  siguiendo: boolean = false;
  $subscription: Subscription;
  $obsLocation: Subject<unknown>;
  $obsGps: Subscription;
  $obsCenterGps: Subscription;
  imgMarcadores = 'assets/img/pin-items.png';

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


  constructor( private gestionRutasService: GestionRutasService,
               private storage: StorageService,
               private geolocationService: GeolocationService ) { }

  ngOnInit() {
    this.$obsLocation = new Subject();
    this.$subscription = this.geolocationService.watchPosition().subscribe( this.$obsLocation );
    this.$obsGps = this.$obsLocation.subscribe( ( data: GeolocationPosition ) => {
        this.latGps = data.coords.latitude;
        this.lngGps = data.coords.longitude;
        this.gps = true;
    } )
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
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
  async comoLlegar( marker: Parquimetro, mapa: string ) {

    if ( mapa === 'google' ) {
      await Browser.open({url: `https://maps.google.com/?q=${marker.latitud},${marker.longitud}`});
    } else if ( mapa === 'apple' ) {
      await Browser.open({url: `maps://maps.google.com/maps?daddr=${marker.latitud},${marker.longitud}&amp;ll=`});
    } else {
      await Browser.open({url: `https://www.waze.com/ul?ll=${marker.latitud}%2C${marker.longitud}&navigate=yes&zoom=17`});
    }
  }

  dragStart( event ) {
    this.infoWindow = false;
  }



}
