import { Component, OnInit, Input, EventEmitter, Output, Renderer2 } from '@angular/core';
import { MapPolygonService } from '../../services/map-polygon.service';
import { LayerBarrio, Parquimetro } from '../../interfaces/markers.interface';
import { Subscription, Subject } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { DataFormService } from 'src/app/services/data-form.service';
import { NavbarService } from '../navbar/navbar.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {

  @Input() zoomMap: number;
  options: google.maps.MapOptions = {
    center: {lat: 40.459706, lng: -3.6899817},
    // zoom: 12.5,
    disableDefaultUI: true,
    gestureHandling: 'greedy',
    rotateControl: true
  };
  vertices: LayerBarrio[];
  palygonos: boolean = true;

  @Input() fabricante: string;
  @Input() marker: Parquimetro;
  @Input() barriosSelec: LayerBarrio[];
  @Input() barriosFull: LayerBarrio[] = [];
  @Input() itemsBarrio: Parquimetro[];
  @Output() closeMap: EventEmitter<boolean> = new EventEmitter();
  @Output() sendCoords: EventEmitter<{lat: number, lng: number}> = new EventEmitter();
  @Output() mapaItems: EventEmitter<string> = new EventEmitter();

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
               private navbarService: NavbarService, ) {

    this.vertices = this.polygonService.barriosLayers;
   }

  
  ngOnInit(): void {
    this.infoWindow = true;
  }

  obtenerPosicion() {
    // this.$obsLocation = new Subject();
    // this.$subscription = this.nativeLocationService.watchPosition().subscribe( this.$obsLocation );
    // this.$obsGps = this.$obsLocation.subscribe( ( data: Geoposition ) => {
    //     this.latGps = data.coords.latitude;
    //     this.lngGps = data.coords.longitude;
    //     this.gps = true;
    // } )
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

  // outPolygon(idx: number) {
  //   console.log(idx);
  //   this.barriosFull[idx].options.fillColor = '#537d79';
  //   this.modalTop = false;
  // }
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
    this.mapaItems.emit( barrio );

  }

  volverAlMapaGeneral() {
    this.itemsBarrio = undefined;
    this.navbarService.mostrarOcultarNavbar.emit( true );
    this.barriosFull[this.idxBarrioSelected].options.fillColor = 'orange';
    this.modalTop = false;
    
    setTimeout( () => {
      this.zoomMap = this.zoomMap;
    }, 100 );
    setTimeout( () => {
      this.zoomMap = 12;
      // this.latitud = 40.459031;
      // this.longitud = -3.689918;
    }, 120 );

    this.gps = false;
    this.$subscription.unsubscribe();

  }

  zoomChangeMap( zoom ) {

    if ( zoom === 17 ) {
      this.itemsBarrio.forEach( item => item.idx = item.alias );
    }
    if ( zoom === 16 ) {
      this.itemsBarrio.forEach( item => item.idx = '' );
    }
  }



}
