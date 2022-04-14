import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
@Component({
    selector: 'app-zoom-range',
    templateUrl: './zoom-range.component.html',
    styles: [
        `
        .mapa-container{
                width: 100%;
                height: 100%;
            }
        .row{
            background-color : white;
            bottom : 50px;
            left   : 50px;
            padding : 10px;
            border-radius: 10px;
            position: fixed;
            z-index: 999;
        }
      `
    ]
})
export class ZoomRangeComponent implements AfterViewInit , OnDestroy{
    mapa!: mapboxgl.Map  ;
    zoom : number = 16;
    center : [number , number] =[-71.2063181 , 46.8120929];
    @ViewChild("mapa") divMapa! : ElementRef ;
    constructor() { }   

    ngOnDestroy(): void {
        this.mapa.off( 'zoom' , () => {} );
        this.mapa.off( 'zoomend' , () => {} );
        this.mapa.off( 'move' , () => {} );
    }

    ngAfterViewInit(): void {
        this.mapa = new mapboxgl.Map({
            container: this.divMapa.nativeElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: this.center,
            zoom: this.zoom
        });

        this.mapa.on( 'zoom' , ()=>{
            this.zoom = this.mapa.getZoom();
        });

        this.mapa.on( 'zoomend' , ()=>{
            if(this.mapa.getZoom() > 18 ){
                this.mapa.zoomTo(18);
            }
        });

        this.mapa.on( 'move' , ( {target} )=>{
            const { lng , lat } = target.getCenter()
            this.center = [ lng,lat ];
        });
    }


    zoomOut(){
        this.mapa.zoomOut();
        this.zoom = this.mapa.getZoom();
    }
    zoomIn(){
        this.mapa.zoomIn();
        this.zoom = this.mapa.getZoom();
        // this.mapa.setZoom(this.mapa.getZoom() + 1 );
    }

    zoomCambio( valor : string ){
        this.mapa.zoomTo( Number(valor) )
    }

}
