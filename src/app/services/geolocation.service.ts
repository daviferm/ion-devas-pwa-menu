import { Injectable } from '@angular/core';
import { Observable, Observer, interval } from 'rxjs';
import { GeolocationPosition } from '../interfaces/markers.interface';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  $intervalo = interval(800);

  constructor() {}

  printCurrentPosition = async () => {

    return new Observable( (observer: Observer<GeolocationPosition>) => {

      this.$intervalo.subscribe( () => {

        Geolocation.getCurrentPosition().then( (position: GeolocationPosition) => {

          observer.next( position )

        }, (err) => {
          console.log('Error al obtener posición GPS!', err);
        } )

      })

      // await Geolocation.getCurrentPosition()

    } )
    // const coordinates = await Geolocation.getCurrentPosition();
  
    // console.log('Current position:', coordinates);
    // return coordinates;
  };

  watchPosition(): Observable<GeolocationPosition>  {

    return new Observable( ( observer: Observer<GeolocationPosition> ) => {

      this.$intervalo.subscribe( () => {
        Geolocation.getCurrentPosition().then( ( position: GeolocationPosition ) => {

          observer.next( position )

        }, err  => {
          console.log('Error de Geololocalización: ', err);
        })
      } )

    } )
  }

}
