import { Component, OnInit, Inject } from '@angular/core';
import { Marcador } from '../../classes/marcador.class';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MapaEditarComponent } from './mapa-editar.component';
import { ActivatedRoute } from '@angular/router';
import { GoogleService } from 'src/app/services/google.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})

export class MapaComponent implements OnInit {

  marcadores: Marcador[] = [];
  results: any[] = [];
  title = 'My first AGM project';
  // lat = -58.51309118415819;
  // lng = -34.52718156096068;
  lat = -34.60118469689359;
  lng = -58.36896909508938;
  adress = '';

  constructor( private snackBar: MatSnackBar,
               public dialog: MatDialog,
               private googleServices: GoogleService,
               private activatedRoute: ActivatedRoute ) {
    this.activatedRoute.params.subscribe( params => {
      this.adress = params.dire;
    });

    /*const nuevoMarcador = new Marcador(-34.60118469689359, -58.36896909508938);
    this.marcadores.push( nuevoMarcador );
    if ( localStorage.getItem('marcadores') ) {
      this.marcadores = JSON.parse( localStorage.getItem('marcadores') );
    }*/
  }

  ngOnInit(): void {
    if ( this.adress != null) {
      this.obtenerDireccion( this.adress );
    }
  }

  obtenerDireccion( texto: string ) {
    this.googleServices.getDireccion( texto )
                      .subscribe( data => {
                        this.results = data;
                        console.log('Results: ', this.results);
                        for (const result of this.results) {
                          const nuevoMarcador = new Marcador(result.geometry.location.lat, result.geometry.location.lng);
                          this.marcadores.push( nuevoMarcador );
                        }
                        this.lat = this.marcadores[0].lat;
                        this.lng = this.marcadores[0].lng;
                      });
  }

  agregarMarcador( evento ) {
    const coords: { lat: number, lng: number } = evento.coords;
    const nuevoMarcador = new Marcador( coords.lat, coords.lng );
    this.marcadores.push( nuevoMarcador );
    this.guardarStorage();
    this.snackBar.open('Marcador agregado', 'Cerrar', { duration: 3000});
    console.log('lat: ', evento.coords.lat, 'lng: ', evento.coords.lng);
  }

  guardarStorage() {
    localStorage.setItem('marcadores', JSON.stringify(this.marcadores));
  }

  editarMarcador( marcador: Marcador ) {
    const dialogRef = this.dialog.open( MapaEditarComponent, {
      width: '250px',
      data: { titulo: marcador.titulo, desc: marcador.desc }
    });
    dialogRef.afterClosed().subscribe(result => {
      if ( !result ) {
        return;
      }
      marcador.titulo = result.titulo;
      marcador.desc = result.desc;
      this.guardarStorage();
      this.snackBar.open('Marcador actualizado', 'Cerrar', { duration: 3000});
  });
  }

  borrarMarcador( i: number ) {
    this.marcadores.splice(i, 1);
    this.guardarStorage();
    this.snackBar.open('Marcador borrado', 'Cerrar', { duration: 3000});
  }

}
