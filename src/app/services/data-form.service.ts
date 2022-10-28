import { HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Parquimetro } from '../interfaces/markers.interface';
import { StorageService } from './storage.service';
import { ajax } from 'rxjs/ajax';


@Injectable({
  providedIn: 'root'
})
export class DataFormService {

  enviarPageHome: EventEmitter<Parquimetro> = new EventEmitter();
  enviarPageBarrios: EventEmitter<Parquimetro[]> = new EventEmitter();
  enviarPageTareas: EventEmitter<Parquimetro> = new EventEmitter();
  enviarPageIncidencias: EventEmitter<Parquimetro> = new EventEmitter();
  enviarPageSoporte: EventEmitter<Parquimetro> = new EventEmitter();


  selector: any;
  input: any;
  urlDataLocal = '../../assets/data/data.json';
  // urlData = 'https://app-devas.firebaseio.com/parkimetros.json';
  urlDataFS = 'https://firestore-devas.firebaseio.com/parkimetros.json';
  urlElemFS = 'https://firestore-devas.firebaseio.com/parkimetros/';

  public DB: Parquimetro[] = [];
  barrio: any = [];
  http: any;

  constructor( private storage: StorageService ) {

    this.getFirebase();

  }


  getParkimetro(barrio, numero?): Parquimetro {

    if (numero.length === 3) { numero = '0' + numero; }
    if (numero.length === 2) { numero = '00' + numero; }
    if (numero.length === 1) { numero = '000' + numero; }

    for(const [key, value] of Object.entries(this.DB)){
      if ( value.alias.endsWith(numero) && value.barrio.startsWith(barrio) ) {
        return value;
      }
    }

    return null;
     
  }

  obtenerBarrrio(barrio) {
    
    this.barrio = this.DB.filter( elem => elem.barrio.startsWith( barrio ) && elem.estado !== 'desmontada');

    return this.barrio;
  }
  obtenerNumeroParkimetros(numero: string) {

    const barrio = this.DB.filter( elem => elem.barrio.startsWith( numero ) && elem.estado !== 'desmontada'  );

    return barrio.length;
  }

  // Obtener arreglo con todos los parquímetros y los guarda en Firebase
  getFirebase() {

    const data = from( fetch(this.urlDataFS) );

    data.subscribe( async(resp) => {
      this.DB = await resp.json();
    } )
  }

  // Base de datos local de parquímetros
  getParkimetrosLocal() {

    const data = from( fetch(this.urlDataLocal) );

    return data.subscribe( async (resp) => {

      const dataLocal = await resp.json();
      // tslint:disable-next-line: forin
      for ( const clave in dataLocal.parkimetros ) {
        this.DB.push(dataLocal.parkimetros[clave]);
      }
    } );
  }
   // Actualizar un parquimetro desde el formulario
   actualizarPark( park: Parquimetro ) {
    const body = JSON.stringify( park );

    const idx = this.DB.findIndex( elem => elem.alias === park.alias);


    const url = `${this.urlElemFS}${idx}.json`;

    const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

    return ajax.put( url, body );

  }
  // Añade un elemento Parquimetro a la Firebase
  nuevoRegistro( elem: Parquimetro ) {

    const body = JSON.stringify( elem );

    return ajax.post( this.urlDataFS, body );
    
  }

  // =========================================================
  // Enviar registro (parquímetro) a la página que lo solicite
  // =========================================================
  sendRegister(item: Parquimetro, page: string) {
    console.log(page);
    
    if ( page === 'home' ) {
      // Enviar a home
      this.enviarPageHome.emit(item);
    } else if ( page === 'listas' ) {
      // Enviar a Listas de Tareas
      this.enviarPageTareas.emit(item)
    } else if ( page === 'soporte' ) {
      // Enviar a Soporte
      this.enviarPageSoporte.emit(item);
    } else if ( page === 'incidencias' ) {
      // Enviar a Incidencias
      this.enviarPageIncidencias.emit(item);
    }
  }

  // ===========================================================
  // Función para enviar barrio seleccionado a la página Barrios
  // ===========================================================
  sendArrayBarrio( items: Parquimetro[] ) {
    this.enviarPageBarrios.emit( items )
  }
}
