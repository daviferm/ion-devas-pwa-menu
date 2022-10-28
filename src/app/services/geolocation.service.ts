import { Injectable } from '@angular/core';
import { Observable, Observer, interval } from 'rxjs';
import { GeolocationPosition } from '../interfaces/markers.interface';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  $intervalo = interval(800);

  constructor() {}

}
