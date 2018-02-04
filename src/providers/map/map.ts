import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';

import { ColoredCircle } from '../../models/coloredCircle';
import { Marker } from '../../models/marker';
import { Triangle } from '../../models/triangle';

declare let google: any;

@Injectable()
export class MapProvider {

    map: any;
    recordInterval: any;

    timeStartRecording: any = 0;
    timeEndRecording: any = 0;

    // Array of coords
    coords: any = [];

    // Array of placed colored circles
    circles: any = [];

    // Array of placed marker
    marker: any = [];

    // Array of placed triangles
    triangles: any = [];



    constructor(public location: Geolocation, public storage: Storage) {
        console.log("INIT: MapProvider");
    }

    initMap(mapElement) {
        this.location.getCurrentPosition().then((pos) => {
            this.map = new google.maps.Map(mapElement.nativeElement, {
                center: {lat: pos.coords.latitude, lng: pos.coords.longitude},
                disableDoubleClickZoom: true,
                zoom: 16
            });
            this.addClickListener();
        })
        //this.recordCurrentLocation();
    }

    addClickListener() {
        this.map.addListener('click', (i) => {
            console.log(i.latLng.toJSON());
        });
    }

    /**
    * Starts recording the current position on a set interval of 2 seconds
    */
    recordCurrentPosition() {
        this.recordInterval = setInterval((i) => {
            this.location.getCurrentPosition().then((pos) => {
                this.coords.push({lat: pos.coords.latitude, lng: pos.coords.longitude});

                if(this.timeStartRecording == 0){
                    this.timeStartRecording = pos.timestamp;
                } else {
                    this.timeEndRecording = pos.timestamp;
                }


                console.log(pos);
            })
        }, 2000);
    }

    /**
    * Stops the recording of the current position
    */
    stopRecording(): any {
        //console.log(this.timeEndRecording - this.timeStartRecording);
        clearInterval(this.recordInterval);
    }

    /**
    * Returns the last recorded position
    */
    getCurrentPosition(): any {
        return this.coords[this.coords.length - 1];
    }

    /**
    * Adds a marker at your current position
    */
    addMarker() {
        if (this.coords.length >= 1){
            let marker = new Marker(google, this.map, 0);
            this.marker.push(marker);
        }
    }

    /**
    * Adds a colored circle at your current position
    */
    addColoredCircle(color) {
        if (this.coords.length >= 1){
            let circle = new ColoredCircle(google, this.map, this.circles.length, this.getCurrentPosition(), color, 0.8, 100);
            this.circles.push(circle);
        }
    }

    /**
    * Adds a triangle at your current position
    * TODO: add a triangle at the position the user tapped on
    */
    addTriangle() {
        if (this.coords.length >= 1){
            let triangle = new Triangle(google, this.map, 0);
            this.triangles.push(triangle);
        }
    }

    /**
    * Changes the display level of the displayed circles
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
    * Ends the current session of the map
    */
    endSession(): any {
        let trail = {
            trainer: "Jonas",
            dog: "hund1",
            path: this.coords,
        }
        let jTrail = JSON.stringify(trail);

        this.storage.set(this.timeStartRecording, jTrail);

        this.stopRecording();

        this.printAllSessions();

        return (this.timeEndRecording - this.timeStartRecording);
    }

    printAllSessions() {
        this.storage.forEach(it => {
            console.log(it);
        })
    }

}
