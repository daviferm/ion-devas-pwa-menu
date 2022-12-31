import { Component, OnInit } from '@angular/core';
import { DataFormService } from '../../services/data-form.service';
import { Parquimetro, LayerBarrio } from '../../interfaces/markers.interface';
import { MapPolygonService } from '../../services/map-polygon.service';
import { NavbarService } from '../../componentes/navbar/navbar.service';
import { GestionRutasService } from '../../services/gestion-rutas.service';

import { IonRouterOutlet } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  abrirModal: boolean = false;
  zoomMapa: number = 12;
  searchMap: boolean;
  polygon: LayerBarrio;
  marker: Parquimetro;
  navegador: string;
  centroMap: {lat: number, lng: number} = {lat: 40.459706, lng: -3.6899817};
  itemsBarrio: Parquimetro[];



  constructor( private dataFormService: DataFormService,
               private polygonService: MapPolygonService,
               private navbarService: NavbarService,
               public routerOutlet: IonRouterOutlet,
               private gestionRutasService: GestionRutasService ) {

    this.gestionRutasService.pageActive = 'home';
  }

  ngOnInit() {

    this.dataFormService.enviarPageHome.subscribe( (item: Parquimetro) => {
      if ( item ) {
        let idBarrio = item.barrio.slice(0,3);
        this.polygon = this.polygonService.getBarrio(idBarrio);
        item.latitud = Number(item.latitud);
        item.longitud = Number(item.longitud);
        this.marker = item;
        this.searchMap = true;
      }
    } )
  }
  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.searchMap = false;

  }

  desplegarModal() {
    this.abrirModal = true;
  }
  closeModal( e ) {
    if ( e ) {
      this.abrirModal = false;
    }
  }

  cerrarMapa( e ) {
    if ( e ) {
      this.searchMap = false;
      this.zoomMapa = 13;
      setTimeout( () => {
        this.zoomMapa = 12;
      }, 100 )
      // this.navbarService.mostrarOcultarNavbar.emit( true );
    }
  }


  mostrarBarrio( barrio ) {

    const centro = this.optenerCentro( barrio );
    
    setTimeout( () => {
      this.zoomMapa = 12;
    }, 50 )
    setTimeout( () => {
      this.zoomMapa = 15;
      this.centroMap = centro;
      }, 70 )

    this.itemsBarrio = this.dataFormService.obtenerBarrrio( String(barrio) );

    this.navbarService.mostrarOcultarNavbar.emit( false );

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
