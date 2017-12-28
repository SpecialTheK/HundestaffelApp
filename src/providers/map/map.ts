import { Injectable } from '@angular/core';

declare let google: any;

@Injectable()
export class MapProvider {

    //map object
    protected map: any;

    constructor() {
        console.log("INIT: MapProvider");
    }

    initMap(mapElement): void {
        this.map = new google.maps.Map(mapElement.nativeElement, {
            center: {lat: 52, lng: 8},
            zoom: 8
        });
    }

}
