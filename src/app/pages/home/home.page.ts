import { Component, OnInit } from '@angular/core';
import { DataFormService } from '../../services/data-form.service';
import { Parquimetro, LayerBarrio } from '../../interfaces/markers.interface';
import { MapPolygonService } from '../../services/map-polygon.service';
import { NavbarService } from '../../componentes/navbar/navbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  zoomMapa: number = 12.5;
  searchMap: boolean = false;
  polygon: LayerBarrio;
  marker: Parquimetro;


  constructor( private dataFormService: DataFormService,
               private polygonService: MapPolygonService,
               private navbarService: NavbarService ) { }

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

  cerrarMapa( e ) {
    if ( e ) {
      this.searchMap = false;
      this.navbarService.mostrarOcultarNavbar.emit( true );
    }
  }

}
