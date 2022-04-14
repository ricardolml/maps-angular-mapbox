import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
    color: string;
    marker?: mapboxgl.Marker;
    centro?: [number, number];
}


@Component({
    selector: 'app-marcadores',
    templateUrl: './marcadores.component.html',
    styles: [

        `
        .mapa-container{
                width: 100%;
                height: 100%;
        }

        .list-group{
            position: fixed;
            top: 20px;
            right: 20px;
            z-index : 99;
            
        }

        li{
            cursor:pointer;
        }
    `
    ]
})
export class MarcadoresComponent implements AfterViewInit {

    @ViewChild("mapa") divMapa!: ElementRef;

    mapa!: mapboxgl.Map;
    zoom: number = 15;
    center: [number, number] = [-71.2063181 , 46.8120929];

    //arreglo de marcadores
    markers: MarcadorColor[] = [];

    constructor() { }

    ngAfterViewInit(): void {

        this.mapa = new mapboxgl.Map({
            container: this.divMapa.nativeElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: this.center,
            zoom: this.zoom
        });

        this.leerLocalStorage()

        // const marketHtml : HTMLElement = document.createElement('div') ;
        // marketHtml.innerHTML = 'Hola Mundo';

        // const maker = new mapboxgl.Marker({
        //     // element : marketHtml
        // }).setLngLat( this.center).addTo(this.mapa);




    }

    agregarMarker() {
        const color = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
        const nuevoMarker = new mapboxgl.Marker({
            draggable: true,
            color
        }).setLngLat(this.center).addTo(this.mapa);
        this.markers.push({ color, marker: nuevoMarker });
        this.guardarMarcadoresLocalStorage();
        nuevoMarker.on('dragend', () => this.guardarMarcadoresLocalStorage());
    }

    irMarker({ marker }: MarcadorColor) {

        this.mapa.flyTo({
            center: marker!.getLngLat()
        })
    }

    guardarMarcadoresLocalStorage() {

        const lngLatArr: MarcadorColor[] = [];

        this.markers.forEach(m => {
            const color = m.color;
            const { lng, lat } = m.marker!.getLngLat();

            lngLatArr.push({ color, centro: [lng, lat] });

        });

        localStorage.setItem('markers', JSON.stringify(lngLatArr));
    }

    leerLocalStorage() {

        if (!localStorage.getItem('markers')) {
            return;
        }
        const markers: MarcadorColor[] = JSON.parse(localStorage.getItem('markers')!);

        for (const market of markers) {
            const nuevoMarker = new mapboxgl.Marker({
                draggable: true,
                color: market.color
            }).setLngLat(market.centro!).addTo(this.mapa);

            nuevoMarker.on('dragend', () => this.guardarMarcadoresLocalStorage());

            this.markers.push({ color: market.color, marker: nuevoMarker });
        }
    }

    borrarMarcador(i: number) {
        this.markers[i].marker?.remove();
        this.markers.splice(i, 1);
        this.guardarMarcadoresLocalStorage();
    }

}
