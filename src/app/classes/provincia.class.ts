import { Ciudad } from './ciudad.class';

export class Provincia {

    public id: number;
    public nombre: string;
    public ciudades: Ciudad[] = [];


    constructor( id: number, nombre: string, ciudades: Ciudad[] ) {
        this.id = id;
        this.nombre = nombre;
        this.ciudades = ciudades;
    }
}
