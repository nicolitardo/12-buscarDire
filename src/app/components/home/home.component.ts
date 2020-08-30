import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GoogleService } from '../../services/google.service';
import { ProvinciaService } from '../../services/provincia.service';
import { Provincia } from 'src/app/classes/provincia.class';
import { Ciudad } from 'src/app/classes/ciudad.class';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {


  // provincias: string[] = ['Buenos Aires', 'Capital Federal', 'Catamarca', 'Chaco',  'Chubut', 'Cordoba',
  //                         'Corrientes', 'Entre Rios', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza',
  //                         'Misiones', 'Neuquen', 'Rio Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
  //                         'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucuman'];
  // selectedQuantity = 'Capital Federal';

  provincias: Provincia[] = [];
  ciudades: Ciudad[] = [];
  forma: FormGroup;
  constructor( private router: Router,
               private fb: FormBuilder,
               private googleService: GoogleService,
               private provinciaService: ProvinciaService
               /*private validadores: ValidadoresService*/ ) {
    this.crearFormulario();
    this.cargarDataAlFormulario();
    this.crearListeners();
    // this.googleService.getLocalidades()
    //                   .subscribe( data => {
    //                     console.log('Localidades', data);
    //                   });
    // console.log( 'Ciudades: ', this.ciudadService.getCiudades() );
    const prov = this.provinciaService.getProvincias();
    // tslint:disable-next-line: forin
    for (const p of prov) {
      this.provincias.push( p );
    }
  }

  ngOnInit(): void {
  }

  irAMapa( textoABuscar: string ) {
    // this.router.navigate([ '/home' ]);
    this.router.navigate([ '/mapa', textoABuscar ]);
  }

  guardar() {
    console.log( this.forma );

    const calle = this.forma.value.calle;
    const altura = this.forma.value.altura;
    const ciudad = this.provinciaService.getNombreLocalidad( this.forma.value.ciudad );
    const provincia = this.provinciaService.getNombreProvincia( this.forma.value.provincia );
    const pais = this.forma.value.pais;
    const dire = calle + ' ' + altura + ', ' + ciudad + ', ' + provincia  + ', ' + pais;

    console.log('dire: ', dire);

    if ( this.forma.invalid ) {
      return Object.values( this.forma.controls ).forEach( control => {
        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( controll => controll.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }

    this.irAMapa( dire );

    // Posteo de informacion y luego se reinicia
    this.forma.reset({
      pais : 'Argentina'
    });
  }

  get calleNoValido() {
    return this.forma.get('calle').invalid && this.forma.get('calle').touched;
  }

  get alturaNoValido() {
    return this.forma.get('altura').invalid && this.forma.get('altura').touched;
  }

  get ciudadNoValido() {
    return this.forma.get('ciudad').invalid && this.forma.get('ciudad').touched;
  }

  get provinciaNoValido() {
    return this.forma.get('provincia').invalid && this.forma.get('provincia').touched;
  }

  crearFormulario() {
    this.forma = this.fb.group({
      calle  : ['', [Validators.required, Validators.minLength(3)] ],
      altura: ['', [ Validators.required ] ],
      ciudad  : ['', [ Validators.required ] ],
      provincia  : ['', [ Validators.required ] ],
      pais  : ['', [ Validators.required ] ]
    });
  }

  cargarDataAlFormulario() {
    this.forma.reset({
      pais: 'Argentina'
    });
  }

  crearListeners() {
    // this.forma.get('calle').valueChanges.subscribe( console.log );
    // this.forma.get('altura').valueChanges.subscribe( console.log );
    // this.forma.get('ciudad').valueChanges.subscribe( console.log );
    this.forma.get('provincia').valueChanges.subscribe( data => {
      this.cargarCiudades();
    });
  }

  cargarCiudades() {
  const id = this.forma.get('provincia').value;
  const prov = this.provinciaService.getProvincia( id );
  this.ciudades = prov.ciudades;
  // console.log('cities: ', this.ciudades);
  }

}
