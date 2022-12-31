import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList, IonSlides, AlertController, IonItemSliding, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { NavbarService } from 'src/app/componentes/navbar/navbar.service';
import { BarrioInterface, Parquimetro } from 'src/app/interfaces/markers.interface';
import { DataFormService } from '../../services/data-form.service';
import { StorageService } from '../../services/storage.service';
import { GestionRutasService } from '../../services/gestion-rutas.service';
import { LayerBarrio } from '../../interfaces/markers.interface';
import { MapPolygonService } from '../../services/map-polygon.service';
import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar, SwiperOptions, Zoom } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);

@Component({
  selector: 'app-barrios',
  templateUrl: './barrios.page.html',
  styleUrls: ['./barrios.page.scss'],
})
export class BarriosPage implements OnInit {

  @ViewChild(IonList) lista: IonList;
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  tareasBarrios: BarrioInterface[] = [];
  mapaNuevo: Parquimetro[];
  tareas: boolean = true;
  reorderDisable: boolean = false;
  // Variable para mostrar el mapa con los parquímetros de la lista
  mapSearch: boolean = false;
  tareaActiva: BarrioInterface;
  paginaActiva: string = 'listas';
  marcadores: Parquimetro[];
  centerLat: number;
  centerLng: number;
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: true,
    allowTouchMove: false,
  };
  openModal: boolean = false;
  polygon: LayerBarrio;

  registroObs: Subscription;

  constructor( public alertController: AlertController,
               public toastController: ToastController,
               private dataFormService: DataFormService,
               private storageService: StorageService,
               private navbarService: NavbarService,
               private gestionRutasService: GestionRutasService,
               private polygonService: MapPolygonService ) {

    this.actualizarTareasStorage();
    this.gestionRutasService.pageActive = 'barrios';
  }

  ngOnInit() {
    this.dataFormService.enviarPageBarrios.subscribe( resp => {
      if ( resp ) {
        this.mapaNuevo = this.ordenarItems( resp );

        this.presentAlertNuevoMapa();
      }
    } )
  }
  doReorder(event: any) {
    this.tareasBarrios = event.detail.complete(this.tareasBarrios);
   
    this.storageService.setLocalStorage('maps-barrios', JSON.stringify(this.tareasBarrios));
  }

  // =================================================
  // Ordenar mapa
  // =================================================
  ordenarItems( items: Parquimetro[] ) {
    items.sort(function (a, b) {
      if ( a.alias > b.alias ) {
        return 1;
      }
      if ( a.alias < b.alias ) {
        return -1;
      }
      // a es igual que b
      return 0;
    });
  
    return items;
  }

  // Mostrar items del barrio
  slideNext(tarea){
    this.tareaActiva = tarea;
    this.tareas = false;
    this.swiper.swiperRef.slideNext(300);
  }
  slidePrev(){
    this.storageService.setLocalStorage( 'maps-barrios', JSON.stringify(this.tareasBarrios) );
    this.tareas = true;
    this.swiper.swiperRef.slidePrev(200);
  }

  
  // Evento para saber cuando termita el evenots de volver al Slide prencipal
  ionSlidePrevEnd() {
    this.tareaActiva = null;
  }

   // =================================================
  // Alert para introducir el título de la tarea
  // =================================================
  async presentAlertNuevoMapa() {
    const alert = await this.alertController.create({
      header: 'Nuevo mapa',
      message: 'Introduce un nombre para la tarea.',
      inputs: [
      {
        name: 'titulo',
        type: 'text',
        min: 3,
        max: 15,
        attributes: {
          autoComplete: 'off'
        },
        placeholder: 'Escribe un título',
        handler: () => {
         console.log('Input tarea...');
        }
      },
      ],
      buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
         console.log('Cancelar...');
        }
      }, {
        text: 'Ok',
        handler: (input) => {
          if ( input.titulo.length > 1 ) {

            this.guardarNuevoMapa( input.titulo );

          } else {
            this.presentToastWithOptions('El título debe tener mas de 1 caracter.');
          }
        
        }
      }
      ]
    });
    await alert.present();
  }
  // =================================================
  // Mensaje Toast en la parte superior
  // =================================================
  async presentToastWithOptions(mensage: string) {
    const toast = await this.toastController.create({
      message: mensage,
      position: 'bottom',
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

  guardarNuevoMapa(titulo: string) {
    const nuevoMapa = {
      localId: new Date().getTime(),
      barrio: this.mapaNuevo[0].barrio,
      titulo: titulo,
      hecho: false,
      items: this.mapaNuevo
    }
    this.tareasBarrios.push( nuevoMapa );
    this.storageService.setLocalStorage( 'maps-barrios',  JSON.stringify(this.tareasBarrios) );
  }

  borrarMapa( idx: number, slider?: IonItemSliding ) {

    if ( slider ) {
      slider.close();
    }
    
    this.tareasBarrios.splice(idx,1);
    this.storageService.setLocalStorage( 'maps-barrios', JSON.stringify(this.tareasBarrios) );
  }

  actualizarTareasStorage() {

    if ( JSON.parse(this.storageService.getLocalStorage('maps-barrios')) ) {
      this.tareasBarrios = JSON.parse(this.storageService.getLocalStorage('maps-barrios'));
    } else {
      this.tareasBarrios = [];
    }
  }
  
  itemOk( slider: IonItemSliding, idx: number ) {
    slider.close();

    if ( !this.tareaActiva.items[idx].hecho ) {
      this.tareaActiva.items[idx].hecho = true;
      this.tareaActiva.items[idx].opacidad = 0.5;
    } else {
      this.tareaActiva.items[idx].hecho = false;
      this.tareaActiva.items[idx].opacidad = 1;
    }
  }
  
  ionChangeCheck( marker ) {
    marker.opacidad = marker.hecho ? 0.5 : 1;
  }

  // Mostrar mapa con los items
  mostrarMapa() {
    this.polygon = this.polygonService.getBarrio( this.tareaActiva.barrio.slice(0,3 ));
    this.marcadores = this.convertirLatLngAnumber(this.tareaActiva.items);
    const numBarrio = this.tareaActiva.barrio.slice(0,3);
    const cetroMapa = this.optenerCentro( Number(numBarrio) );
    this.centerLat = Number(cetroMapa.lat);
    this.centerLng = Number(cetroMapa.lng);
    this.mapSearch = true;
    this.navbarService.mostrarOcultarNavbar.emit( false );
  }
  cerrandoMapa(event: boolean) {
    if ( event ) {
      this.mapSearch = false;
      this.navbarService.mostrarOcultarNavbar.emit( true );
    }
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
        case 157:
          centro = { lat: 40.456294, lng: -3.660946 };
          break;
        default:
          centro = { lat: 40.459081, lng: -3.693029 };
          break;
    }
    return centro;
  }

  actualizarLocalStorage() {
    this.tareasBarrios = JSON.parse(this.storageService.getLocalStorage('tareas-mant'));

    if ( !this.tareasBarrios ) {
      this.tareasBarrios = [];
    }
  }

  convertirLatLngAnumber( items: Parquimetro[] ) {

    items.forEach( (elem) => {
      elem.latitud = Number(elem.latitud);
      elem.longitud = Number(elem.longitud);
      elem.info = true;
      
      elem.options = ( !elem.hecho ) ? { opacity: 1 } : { opacity: .5 };
    } )
    return items;

  }

}
