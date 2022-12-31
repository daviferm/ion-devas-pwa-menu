import { Component, OnInit, Input, EventEmitter, Output, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { MapPolygonService } from '../../services/map-polygon.service';
import { LayerBarrio, Parquimetro } from '../../interfaces/markers.interface';
import { Subscription, Subject } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { DataFormService } from 'src/app/services/data-form.service';
import { NavbarService } from '../navbar/navbar.service';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { GeolocationService } from 'src/app/services/geolocation.service';
// import { Geoposition } from '@ionic-native/geolocation';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {

  @Output() closeMap: EventEmitter<boolean> = new EventEmitter();
  @Output() sendCoords: EventEmitter<{lat: number, lng: number}> = new EventEmitter();
  @Output() mapaItems: EventEmitter<string> = new EventEmitter();
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapMarker, { static: false }) markerSoporte: MapMarker;
  @Input() gpsLatLng: {alias: string, lat: number, lng: number};

  @Input() zoomMap: number;
  @Input() centroMap: {lat: number, lng: number};
  @Input() fabricante: string;
  @Input() marker: Parquimetro;
  @Input() barriosSelec: LayerBarrio[];
  @Input() barriosFull: LayerBarrio[] = [];
  @Input() itemsBarrio: Parquimetro[];
  @Input() markerSoport: Parquimetro;
  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    gestureHandling: 'greedy',
    rotateControl: true,
    panControl: true
  };
  markerOptions: google.maps.MarkerOptions = {
    opacity: 1,
    // animation: DROP,
    // icon: this.imgIcon
  }
  soportOptions: google.maps.MarkerOptions = {
    opacity: 1,
    draggable: true
  }
  vertices: LayerBarrio[];
  palygonos: boolean = true;

  // imgMarcadores: string = 'assets/img/pin-items.png';
  imgMarcadores: string = 'assets/img/pin-marker-alias.png';
  imgBase: string = 'assets/img/pin-alias.png';
  imgPosition = 'assets/img/marker-car.png';

  latGps: number;
  lngGps: number;
  gps = false;
  textInfo = { barrio: '', numero: 0 };
  modalTop = false;
  $subscription: Subscription;
  $obsLocation: Subject<unknown>;
  $obsGps: Subscription;
  $obsCenterGps: Subscription;
  siguiendo: boolean = false;
  idxBarrioSelected: number;
  infoWindow: boolean = false;


  constructor( public polygonService: MapPolygonService,
               private modalCtrl: ModalController,
               private dataFormService: DataFormService,
               private renderer: Renderer2,
               private navbarService: NavbarService,
               private geolocationService: GeolocationService ) {

    this.vertices = this.polygonService.barriosLayers;
   }

  
  ngOnInit(): void {
    this.infoWindow = true;
    
  }
  // logCenter() {
  //   console.log(JSON.stringify(this.map.getCenter()))
  // }

  obtenerPosicion() {
    this.$obsLocation = new Subject();
    this.$subscription = this.geolocationService.watchPosition().subscribe( this.$obsLocation );
    this.$obsGps = this.$obsLocation.subscribe( ( data: any ) => {
        this.latGps = data.coords.latitude;
        this.lngGps = data.coords.longitude;
        this.gps = true;
    } )
  }
  
  cerrarMapa() {
    this.closeMap.emit( true );
  }
  cerrarToast( toas ) {
   
    this.renderer.addClass( toas, 'bounceOutUp' );
  }

  dragStart(  ) {
    // Ocultas ToastController
    this.infoWindow = false;

  }
  dragEnd( event ) {
    this.sendCoords.emit( event.coords );
  }

  sobrePolygon(idx: number) {
    this.vertices.forEach( v => {
      v.options.fillColor = this.polygonService.fillColor;
    } )
    this.vertices[idx].options.fillColor = '#537d79';
    const numBarrio = this.vertices[idx].id.substring(0, 3);
    const barrio = this.dataFormService.obtenerNumeroParkimetros(numBarrio);
    this.textInfo.numero = barrio;
    this.textInfo.barrio = this.vertices[idx].id;
    this.modalTop = true;
    this.idxBarrioSelected = idx;
    this.palygonos = false;
    setTimeout( () => {
      this.palygonos = true;
    }, .1 )
  }

  mapaClick() {
    this.vertices.forEach( v => {
      v.options.fillColor = this.polygonService.fillColor;
    } );
    this.palygonos = false;
    setTimeout( () => {
      this.palygonos = true;
    }, .1 )
    this.modalTop = false;
  }

  async abrirModal( marker: Parquimetro ) {

    // const modal = await this.modalCtrl.create({
    //   component: DetallesModalComponent,
    //   componentProps: {
    //     marker
    //   }
    // });
   
    // await modal.present();
  }

  mostrarBarrio() {

    this.obtenerPosicion();
    const barrio = this.textInfo.barrio.slice(0,3);
    const centro = this.optenerCentro( barrio );
    setTimeout( () => {
      this.zoomMap = 12;
      }, 50 )

    setTimeout( () => {
      this.zoomMap = 15;
      this.centroMap = centro;
      }, 70 )

    this.itemsBarrio = this.dataFormService.obtenerBarrrio( String(barrio) );
    this.itemsBarrio.forEach( item => {
      item.latitud = Number( item.latitud );
      item.longitud = Number( item.longitud );
    } )

    this.navbarService.mostrarOcultarNavbar.emit( false );


  }

  volverAlMapaGeneral() {
    this.itemsBarrio = undefined;
    this.navbarService.mostrarOcultarNavbar.emit( true );
    this.modalTop = false;
    
    setTimeout( () => {
      this.zoomMap = this.zoomMap;
    }, 100 );
    setTimeout( () => {
      this.zoomMap = 12;
      this.centroMap = {lat: 40.459706, lng: -3.6899817};
    }, 120 );

    this.gps = false;
    this.$subscription.unsubscribe();

  }

  zoomChangeMap( zoom ) {

    console.log('Cambio de zoom: ', zoom);

    // if ( zoom === 17 ) {
    //   this.itemsBarrio.forEach( item => item.idx = item.alias );
    // }
    // if ( zoom === 16 ) {
    //   this.itemsBarrio.forEach( item => item.idx = '' );
    // }
  }

  draggableChanged() {
    const position = this.markerSoporte.getPosition();
    this.sendCoords.emit( {lat: position.lat(), lng: position.lng()} );
  }


  // Optener cetro del mapa según el barrio
  optenerCentro(barrio) {
    const numBarrio = Number(barrio);
    let centro;
    switch (numBarrio) {
        case 44:
            centro = { lat: 40.436347, lng: -3.667389 };
            break;
        case 45:
            centro = { lat: 40.432375, lng: -3.676183 };
            break;
        case 46:
            centro = { lat: 40.433368, lng: -3.683588 };
            break;
        case 51:
            centro = { lat: 40.445408, lng: -3.684342 };
            break;
        case 52:
            centro = { lat: 40.443262, lng: -3.669103 };
            break;
        case 53:
            centro = { lat: 40.448204, lng: -3.67265 };
            break;
        case 54:
            centro = { lat: 40.455497, lng: -3.677462 };
            break;
        case 55:
            centro = { lat: 40.461893, lng: -3.679066 };
            break;
        case 56:
            centro = { lat: 40.472714, lng: -3.677789 };
            break;
        case 61:
            centro = { lat: 40.451753, lng: -3.707646 };
            break;
        case 62:
            centro = { lat: 40.452326, lng: -3.696489 };
            break;
        case 63:
            centro = { lat: 40.459081, lng: -3.693029 };
            break;
        case 64:
            centro = { lat: 40.469211, lng: -3.69408 };
            break;
        case 65:
            centro = { lat: 40.466564, lng: -3.702468 };
            break;
        case 66:
            centro = { lat: 40.459403, lng: -3.704318 };
            break;
        case 75:
            centro = { lat: 40.441979, lng: -3.698296 };
            break;
        case 76:
            centro = { lat: 40.441833, lng: -3.71095 };
            break;
        case 84:
            centro = { lat: 40.476389, lng: -3.708886 };
            break;
        case 85:
            centro = { lat: 40.48158, lng: -3.697391 };
            break;
        case 93:
            centro = { lat: 40.449879, lng: -3.714955 };
            break;
        case 94:
          centro = { lat: 40.461083, lng: -3.710878 };
          break;
        case 151:
          centro = { lat: 40.428222, lng: -3.654680 };
          break;
        case 153:
          centro = { lat: 40.434504, lng: -3.649170 };
          break;
        case 155:
          centro = { lat: 40.442607, lng: -3.653534 };
          break;
        case 157:
          centro = { lat: 40.456294, lng: -3.660946 };
          break;
        default:
          centro = { lat: 40.459081, lng: -3.693029 };
          break;
    }
    return centro;
  }

}
