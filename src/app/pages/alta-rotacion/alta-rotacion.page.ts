import { Component, OnInit } from '@angular/core';
import { AltaRotacion, Parquimetro } from 'src/app/interfaces/markers.interface';
import { DataFormService } from 'src/app/services/data-form.service';
import { NavbarService } from '../../componentes/navbar/navbar.service';



@Component({
  selector: 'app-alta-rotacion',
  templateUrl: './alta-rotacion.page.html',
  styleUrls: ['./alta-rotacion.page.scss'],
})
export class AltaRotacionPage implements OnInit {

  itemsAltaRotacion: Parquimetro[];
  barriosSort: AltaRotacion[] = [];
  cardMapa: boolean = false;
  iconPin = 'assets/img/pin-marker.png';


  constructor( public dataService: DataFormService,
               private navbarService: NavbarService ) {
      localStorage.setItem('page', 'alta-rotacion');
      this.dataService.obtenerItemsAltaRotacion();
  }

  ngOnInit() {
      this.getLogacStorage();
  }
  
  getLogacStorage() {
      this.itemsAltaRotacion = JSON.parse( localStorage.getItem( 'itemsAR' ) );
      this.barriosSort = JSON.parse( localStorage.getItem( 'barriosAR' ) );
  }


  mostrarMapa() {
      this.cardMapa = true;
      this.navbarService.mostrarOcultarNavbar.emit( true );
  }

  cerrarMapa( event: boolean ) {
      if ( !event ) {
          this.cardMapa = false;
          this.navbarService.mostrarOcultarNavbar.emit( false );
      }
  }

  chageZoomMap( event ) {
    
  }


}