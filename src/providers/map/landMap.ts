import { Injectable } from '@angular/core';

import { MapProvider } from '../map/map';

declare let google: any;

@Injectable()
export class LandMapProvider extends MapProvider{

    constructor() {
        super();
        console.log("INIT: LandMapProvider");
    }

    addMarker(): void {
        //'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSa0ZMAEcKoryrOSmtwf1ETVyOIh9rTaQ8aWH-r3xTScG2tMHR',
        let marker = new google.maps.Marker({
            position: {lat: 52, lng: 8},
            title: "Test Marker",
            icon: {
                path: 'M -1 1 1 -1 M 1 1 -1 -1',
                scale: 2
            },
            map: this.map
        });
    }

}
