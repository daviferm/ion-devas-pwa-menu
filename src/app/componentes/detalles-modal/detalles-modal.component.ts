import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Parquimetro } from '../../interfaces/markers.interface';
import { GestionRutasService } from '../../services/gestion-rutas.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-detalles-modal',
  templateUrl: './detalles-modal.component.html',
  styleUrls: ['./detalles-modal.component.scss'],
})
export class DetallesModalComponent implements OnInit {

  @Output() cerrarAlert: EventEmitter<boolean> = new EventEmitter();
  @Output() tareaRealizada: EventEmitter<Parquimetro> = new EventEmitter();
  @Input() titulo: string;
  @Input() item: Parquimetro;
  rutaActiva: string;

  constructor( private gestionRutasService: GestionRutasService ) {}

  ngOnInit() {
    this.rutaActiva = this.gestionRutasService.pageActive;
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
  closeModal( event ) {
    if ( event.target.className.includes('modal-background') ) {
      this.cerrarAlert.emit( true );
    }
  }

  tareaHecha( item: Parquimetro ) {
    this.tareaRealizada.emit( item );
  }


  isMobileIphone(){
    return (
      (navigator.userAgent.match(/iPhone/i)) ||
      (navigator.userAgent.match(/iPod/i)) ||
      (navigator.userAgent.match(/iPad/i))
    );
}

}
