import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { LayerBarrio, Parquimetro } from '../../interfaces/markers.interface';
import { GestionRutasService } from '../../services/gestion-rutas.service';
import { ToastController, AlertController } from '@ionic/angular';
import { IonSlides} from '@ionic/angular';
import { DataFormService } from 'src/app/services/data-form.service';
import { MapPolygonService } from '../../services/map-polygon.service';
import { NavbarService } from 'src/app/componentes/navbar/navbar.service';
import { Browser } from '@capacitor/browser';
import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';
import { GeolocationService } from '../../services/geolocation.service';


@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.page.html',
  styleUrls: ['./soporte.page.scss'],
})
export class SoportePage implements OnInit {

  // @ViewChild('update') btnUpdate: ElementRef;
  // @ViewChild('mySlider')  slides: IonSlides;

  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: true,
    allowTouchMove: false,
  };
  // Número que se introduce en el input
  alias: number;
  zoom: number = 12;
  marcador: Parquimetro;
  nuevoMarker: {alias: string, lat: number, lng: number };
  lat: number;
  lng: number;
  selectedBarrio: LayerBarrio;
  mapSearch: boolean;
  pageSelected = 'soporte';
  coordGps: any;


  numSearch: number;
  checkNuevo: boolean = false;

  constructor( private dataFormService: DataFormService,
               private mapPolygonService: MapPolygonService,
               private gestioRutasService: GestionRutasService,
               private navbarService: NavbarService,
               private geolocationService: GeolocationService,
               private toastController: ToastController,
               private alertCtrl: AlertController ) {

    this.gestioRutasService.pageActive = 'soporte';
    this.geolocationService.getGeolocation()
            .then( response => this.coordGps = response );
  }

  ngOnInit() {
    this.dataFormService.enviarPageSoporte.subscribe( (item: Parquimetro) => {
      console.log(item);
      if ( item ) {
        this.swiper.swiperRef.slideNext(300);

        this.zoom = 12;
        this.marcador = item;
        this.marcador.latitud = Number(item.latitud);
        this.marcador.longitud = Number(item.longitud);
        this.lat = Number(item.latitud);
        this.lng = Number(item.longitud);
        // this.selectedBarrio = [];
        this.selectedBarrio = this.mapPolygonService.getBarrio( item.barrio.slice(0,3) );
        this.mapSearch = true;
        this.gestioRutasService.soportePage = true;
        setTimeout( () => {
          this.zoom = 14;
        }, 100 );
        this.navbarService.mostrarOcultarNavbar.emit( false );
      } 
    });

    // this.gestioRutasService.getLocation.subscribe( (resp: boolean) => {
    //   if ( this.mapSearch ) {
    //     // this.navbarService.mostrarOcultarNavbar.emit( false );
    //   }
    //   if ( resp ) {
    //     this.geolocationService.getGeolocation()
    //         .then( response => {
    //           this.coordGps = response;
    //           console.log(this.coordGps);
    //         } );
    //   }
    // } )
  }

  // ionViewWillEnter() {
  //   console.log('ionViewWillEnter');
  // }
  // ionViewDidEnter() {
  //   console.log('ionViewDidEnter');
  // }
  // ionViewWillLeave() {
  //   console.log('ionViewWillLeave');
  // }
  // ionViewDidLeave() {
  //   console.log('ionViewDidLeave');
  // }

  // Evento para saber cuando termita el evenots de volver al Slide prencipal
  ionSlidePrevEnd() {
    // this.tareaActiva = null;
    console.log('Volver atras...');
  }


  changeInput( event: any ) {
    this.alias = event.detail.value;
  }
  
  mostrarMapa() {

    const aliasStr = String( this.alias );
    
    if ( aliasStr.length != 10 ){
      console.log('El número debe tener 10 dígitos!!');
    } else {
      console.log('Mostrando Mapa..');
      this.lat = Number( this.coordGps.coords.latitude );
      this.lng = Number( this.coordGps.coords.longitude );
      this.marcador = {
            alias: String(this.alias),
            barrio: '',
            direccion: '',
            empresa: '',
            estado: '',
            fabricante: '',
            latitud: this.lat,
            longitud: this.lng,
            tarifa: ''
          }
      // this.nuevoMarker = {
      //   alias: String(this.alias),
      //   lat: this.lat,
      //   lng: this.lng
      // };
      // console.log(this.nuevoMarker);
      // this.marcador.alias = String(this.alias);
      // this.marcador.latitud = this.lat;
      // this.marcador.longitud = this.lng;
      this.zoom = 12;
      this.mapSearch = true;
      this.gestioRutasService.soportePage = true;
      this.swiper.swiperRef.slideNext(300);
      this.navbarService.mostrarOcultarNavbar.emit( false );
      // setTimeout( () => {
      //   this.zoom = 14;
      // }, 100 );
    }
  }

  // cerrarMana( event ) {
  //   this.mapSearch = false;
  //   this.navbarService.mostrarOcultarNavbar.emit( true );
  //   this.gestioRutasService.soportePage = false;
  //   this.marcador = {
  //     alias: '',
  //     barrio: '',
  //     direccion: '',
  //     empresa: '',
  //     estado: '',
  //     fabricante: '',
  //     latitud: 0,
  //     longitud: 0,
  //     tarifa: ''
  //   }
  // }

  getCoords( coords ) {
    this.marcador.latitud = coords.lat;
    this.marcador.longitud = coords.lng;
  }
  enviarPosicion() {

    const tlf = '34638372031';
    const url = `https://api.whatsapp.com/send?phone=${tlf}&text=Soporte-App-Devas:%20Número:%20${this.marcador.alias},%20latitud:${this.marcador.latitud},%20longitud:${this.marcador.longitud}`;

    Browser.open( {url: url} );

  }

  ionChangeSearch( event ) {
    this.numSearch = event.detail.value;
  }
  
  buscarItem() {
    
    const strNumber = String( this.numSearch );
    
    if ( strNumber.length == 10 ) {
      // Combertir en string
      const numeroStr = String( this.numSearch );
      // Comprobar si el barrio tiene 3 o 2 dígitos
      const barrio = (numeroStr.substring( 2, 3 ) == '0') ? numeroStr.substring( 3, 5 ) : numeroStr.substring( 2, 5 );
      const alias = numeroStr.substring( 6, numeroStr.length );
      // Buscar parquímetro
      const item = this.dataFormService.getParkimetro( barrio, alias );

      if ( item ) {
        this.marcador = { ...item };
      }
  
    }
  }



   // =================================================
  // Mensaje Toast en la parte superior
  // =================================================
  async presentToastWithOptions(mensage: string) {
    const toast = await this.toastController.create({
      message: mensage,
      position: 'top',
      duration: 2000,
      cssClass: 'mytoast',
      buttons: [
        {
          side: 'start',
          icon: 'map-outline',
        }, {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();
  }

  prevSlide() {
    this.mapSearch = false;
    this.navbarService.mostrarOcultarNavbar.emit( true );
    this.gestioRutasService.soportePage = false;
    this.swiper.swiperRef.slidePrev(200);
  }

}
