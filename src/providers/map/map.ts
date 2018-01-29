import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

import { ColoredCircle } from '../../models/coloredCircle';

declare let google: any;

@Injectable()
export class MapProvider {

    map: any;
    inter: any;
    coords: any = [];

    circles: any = [];

    constructor(public location: Geolocation) {
        console.log("INIT: MapProvider");
    }

    initMap(mapElement) {
        this.location.getCurrentPosition().then((pos) => {
            this.map = new google.maps.Map(mapElement.nativeElement, {
                center: {lat: pos.coords.latitude, lng: pos.coords.longitude},
                zoom: 16
            });
        })
        //this.recordCurrentLocation();
    }

    /**
    *
    */
    recordCurrentLocation() {
        //TODO: this needs rework
        this.inter = setInterval((i) => {
            this.location.getCurrentPosition().then((pos) => {
                this.coords.push({lat: pos.coords.latitude, lng: pos.coords.longitude});
                console.log(pos);
            })
        }, 2000);
    }

    /**
    *
    */
    stopRecording() {
        clearInterval(this.inter);
    }

    /**
    *
    */
    getCurrentLocation(): any {
        return this.coords[this.coords.length - 1];
    }

    /**
    *
    */
    addMarker() {
        if (this.coords.length >= 1){
            let marker = new google.maps.Marker({
                position: this.getCurrentLocation(),
                title: "Current Location Marker"
            });
            marker.setMap(this.map);
        }
    }

    /**
    *
    */
    addColoredCircle(color) {
        if (this.coords.length >= 1){
            let circle = new ColoredCircle(google, this.map, this.circles.length, this.getCurrentLocation(), color, 0.8, 100);
            this.circles.push(circle);
        }
    }

    /**
    *
    */
    changeCircleLevelDisplay(level) {
        for (let c of this.circles){
            if(c.opacity < level){
                c.hide();
            }else {
                c.show();
            }
        }
    }

    /**
    *
    */
    endSession() {
        this.stopRecording();
    }

}
