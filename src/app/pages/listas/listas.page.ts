import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList, IonSlides, AlertController, ToastController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';
import { NavbarService } from '../../componentes/navbar/navbar.service';
import { ListaInteface, Parquimetro } from '../../interfaces/markers.interface';
import { DataFormService } from '../../services/data-form.service';
import { Subscription } from 'rxjs';
// import { IonReorderGroup } from '@ionic/angular';
// import { ItemReorderEventDetail } from '@ionic/core';
import { ModalController } from '@ionic/angular';
import { GestionRutasService } from '../../services/gestion-rutas.service';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.page.html',
  styleUrls: ['./listas.page.scss'],
})
export class ListasPage implements OnInit {

  @ViewChild(IonList) lista: IonList;
  @ViewChild('mySubNav', {static: true}) myNavSub: IonSlides;
  tareasLista: ListaInteface[] = [];
  idxLista: number;
  idxItem: number;
  tareas: boolean = true;
  reorderDisable: boolean = false;
  // Variable para mostrar el mapa con los parquímetros de la lista
  mapSearch: boolean = false;
  tareaActiva: ListaInteface;
  paginaActiva: string = 'listas';
  marcadores: Parquimetro[];
  // centerLat: number;
  // centerLng: number;
  centerMap: {lat: number, lng: number};
  slideOpts = {
    initialSlide: 0,
    allowTouchMove: false,
    speed: 400
  };
  // openModal: boolean = false;
  modalUploadImg: boolean = false;
  registroObs: Subscription;

  constructor( private storage: StorageService,
               private navbarService: NavbarService,
               public alertController: AlertController,
               public toastController: ToastController,
               private dataService: DataFormService,
               public modalController: ModalController,
               private gestionRutasService: GestionRutasService ) {
              
    this.actualizarLocalStorage();
    this.mapSearch = false;
    this.gestionRutasService.pageActive = 'listas';
    
    }

  ngOnInit() {

    this.registroObs = this.dataService.enviarPageTareas.subscribe( (resp: Parquimetro) => {
    
      // Comprobar si el parquimetro está en la lista
      const existe = this.tareaActiva.items.find( item => item.alias === resp.alias );
      if ( !existe ) {
        resp.latitud = Number( resp.latitud );
        resp.longitud = Number( resp.longitud );
        this.tareaActiva.items.push( resp );
        // this.storage.setStorage('lista-tareas', this.tareasLista);
        this.storage.setLocalStorage('lista-tareas', JSON.stringify( this.tareasLista ));
      } else {
        this.presentAlertExiste();
      }
    } )

  }

  ngOnDestroy() {
    this.registroObs.unsubscribe();
  }
  
  doReorder(event: any) {
    // Comprobar si estamos en lista de tareas
    if ( !this.tareaActiva ) {
    this.tareasLista = event.detail.complete(this.tareasLista);
    } else {
    // Comprobar si estamos dentro de una lista
    this.tareaActiva.items = event.detail.complete(this.tareaActiva.items);
    }
    // this.storage.setStorage('lista-tareas', this.tareasLista);
    this.storage.setLocalStorage('lista-tareas', JSON.stringify( this.tareasLista ));
  }
  
  
  borrarItem(idx) {
    this.lista.closeSlidingItems()
    this.tareaActiva.items.splice(idx,1);
    // this.storage.setStorage('lista-tareas', this.tareasLista);
    this.storage.setLocalStorage('lista-tareas', JSON.stringify( this.tareasLista ));
  }
  
  borrarTarea( idx ) {
    this.lista.closeSlidingItems();
    this.tareasLista.splice(idx,1);
    // this.storage.setStorage('lista-tareas', this.tareasLista);
    this.storage.setLocalStorage('lista-tareas', JSON.stringify( this.tareasLista ));
  }
  itemEliminadoMapa( tarea: ListaInteface ) {
    const idx = this.tareasLista.findIndex( t => t.localId === tarea.localId );
    this.tareasLista.splice( idx, 1, tarea );
    this.storage.setLocalStorage( 'lista-tareas', JSON.stringify( this.tareasLista ));
    this.actualizarLocalStorage();
    if ( tarea.items.length === 0 ) {
      this.cerrandoMapa( true );
    }
    this.presentToastWithOptionsTop('Tarea realizada.');
  }
  
  verInfo( item: Parquimetro, titulo: string ) {
    // console.log(item);
    console.log('Información del parquímetro..');
  }


  mostrarImagen(i: number) {
    this.idxItem = i;
    this.modalUploadImg = true;
  }
  mostrarModalUploadImg( i: number) {

    this.idxItem = i;
    this.modalUploadImg = true;
  }
  cerrarModalUploadImg( tarea: ListaInteface ) {

    if ( tarea ) {
      this.tareasLista.splice( this.idxLista, 1, tarea );
      this.storage.setLocalStorage( 'lista-tareas', JSON.stringify(this.tareasLista) );
    }
    this.modalUploadImg = false;
  }
  
  nextSlide(tarea, i) {
    this.idxLista = i;
    this.tareaActiva = tarea;
    this.myNavSub.slideNext();
    this.tareas = false;
  }
  
  prevSlide() {
    this.myNavSub.slidePrev();
    this.tareas = true;
    // Guardar cambios en el Storage
    // this.storage.setStorage('lista-tareas', this.tareasLista);
    this.storage.setLocalStorage( 'lista-tareas', JSON.stringify(this.tareasLista) );
  }
  // Evento para saber cuando termita el evenots de volver al Slide prencipal
  ionSlidePrevEnd() {
    this.tareaActiva = null;
  }
  // =================================================
  // Mostrar mapa con todos los parquímetros de la lista
  // =================================================
  mostrarMapa(): void {
    if ( this.tareaActiva.items.length > 0 ) {
      this.navbarService.mostrarOcultarNavbar.emit( false );
      this.gestionRutasService.listasPage = true;
      this.marcadores = this.tareaActiva.items;
      this.centerMap = {lat: Number(this.tareaActiva.items[0].latitud), lng: Number(this.tareaActiva.items[0].longitud)};
      this.mapSearch = true;
    }
  }
 
  // =================================================
  // Cerrar mapa
  // =================================================
  cerrandoMapa( event: boolean ) {
    if ( event ) {
      this.navbarService.mostrarOcultarNavbar.emit( true );
      this.mapSearch = false;
      this.gestionRutasService.listasPage = false;
    }
  }
  // =================================================
  // Alert para introducir el título de la tarea
  // =================================================
  async presentAlertTarea() {
    const alert = await this.alertController.create({
      header: 'Nueva tarea',
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

            this.guardarNuevaTarea( input.titulo );

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
  // Mensaje Toast en la parte inferior
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
  // =================================================
  // Mensaje Toast en la parte superior
  // =================================================
  async presentToastWithOptionsTop(mensage: string) {
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
  // =================================================
  // Alert por si el parquimetro está en la lista
  // =================================================
  async presentAlertExiste() {
    const alert = await this.alertController.create({
      header: 'ESTA EN LA LISTA',
      message: 'El parquímetro ya se encuentra en la lista.',
      buttons: [{text: 'Ok'}]
    })
    
    alert.present();
    
  }
  
  
  guardarNuevaTarea(titulo: string) {
    const newtarea: ListaInteface = {
      localId: new Date().getTime(),
      titulo: titulo,
      items: []
    }
    this.tareasLista.push( newtarea );
    // this.storage.setStorage('lista-tareas', this.tareasLista);
    this.storage.setLocalStorage('lista-tareas', JSON.stringify( this.tareasLista ));
  }
  
  // actualizarTareasStorage() {
  //   this.tareasLista = [];
  //   this.storage.getStorage('lista-tareas').then( (resp) => {

  //     if ( resp ) {
  //     resp.forEach( (elem: any) => {
  //       const tarea: ListaInteface = {
  //         localId: elem.localId,
  //         titulo: elem.titulo,
  //         items: elem.items
  //       }
  //       this.tareasLista.push( tarea );
  //     } )
  //     }
  //     // console.log(this.tareasLista);
  //   } )
  // }

  actualizarLocalStorage() {
    this.tareasLista = JSON.parse(this.storage.getLocalStorage('lista-tareas'));

    if ( !this.tareasLista ) {
      this.tareasLista = [];
    }
  }
  

}
