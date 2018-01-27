import { Injectable } from '@angular/core';

declare let google: any;

@Injectable()
export class MapProvider {

    protected google: any;
    protected map: any;

    constructor() {
        this.google = google;
        console.log("INIT: MapProvider");
    }

    initMap(mapElement) {
        this.map = new this.google.maps.Map(mapElement.nativeElement, {
            center: {lat: 52, lng: 8},
            zoom: 8
        });
    }

}
