import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  constructor( private http: HttpClient ) { }

  getDireccion( textoABuscar: string ) {
    const raw = 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY';
    const urlBase = 'https://maps.googleapis.com/maps/api/geocode/json';
    const urlDireccion = '1600+Amphitheatre+Parkway,+Mountain+View,+CA';
    const apiKey = 'AIzaSyDNOu2JQ001PxZY-GVwFvVou0_6h_Sj-14';
    const url = `${ urlBase }?address=${ textoABuscar }&key=${ apiKey }`;

    console.log({ textoABuscar });
    return this.http.get( url )
                    .pipe( map ( (res: any) => {
                      //  console.log('direccion: ', res.results);
                       return res.results;
                    }));
  }

  getLocalidades() {
    const url = 'https://infra.datos.gob.ar/catalog/modernizacion/dataset/7/distribution/7.5/download/localidades.json';
    return this.http.get( url )
                    .pipe( map ( (res: any) => {
                      //  console.log('direccion: ', res.results);
                       return res.results;
                    }));
  }
}
