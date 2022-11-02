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

  comoLlegar( marker: Parquimetro, google: boolean ) {

    console.log('Google Maps: ', google);
    if ( google ) {
      Browser.open({url: `https://maps.google.com/?q=${marker.latitud},${marker.longitud}`});
    } else {
      Browser.open({url: `maps://maps.google.com/maps?daddr=${marker.latitud},${marker.longitud}&amp;ll=`});
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
}
