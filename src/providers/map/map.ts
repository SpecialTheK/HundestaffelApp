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

    testTrailID: any = 0;

    trailObj = {
        trainer: "",
        dogs: [],
        startTime: 0,
        endTime: 0,
        path: [],
        marker: [],
        circles: [],
        triangles: []
    }


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
                this.trailObj.path.push({lat: pos.coords.latitude, lng: pos.coords.longitude});

                if(this.trailObj.startTime == 0){
                    this.trailObj.startTime = pos.timestamp;
                } else {
                    this.trailObj.endTime = pos.timestamp;
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
        return this.trailObj.path[this.trailObj.path.length - 1];
    }

    /**
    * Adds a marker at your current position
    */
    addMarker() {
        if (this.trailObj.path.length >= 1){
            let marker = new Marker(google, this.map, this.trailObj.marker.length, this.getCurrentPosition(), "Test123");
            this.trailObj.marker.push(marker.marker);
        }
    }

    /**
    * Adds a colored circle at your current position
    */
    addColoredCircle(color) {
        if (this.trailObj.path.length >= 1){
            let circle = new ColoredCircle(google, this.map, this.trailObj.circles.length, this.getCurrentPosition(), color, 0.8, 100);
            this.trailObj.circles.push(circle.circle);
        }
    }

    /**
    * Adds a triangle at your current position
    * TODO: add a triangle at the position the user tapped on
    */
    addTriangle() {
        if (this.trailObj.path.length >= 1){
            let triangle = new Triangle(google, this.map, this.trailObj.triangles.length, this.getCurrentPosition());
            this.trailObj.triangles.push(triangle.triangle);
        }
    }

    /**
    * Changes the display level of the displayed circles
    */
    changeCircleLevelDisplay(level) {
        // TODO: Faaaak!
    }

    /**
    * Ends the current session of the map
    */
    endSession(): any {
        let jTrail = JSON.stringify(this.trailObj);

        this.storage.set(this.testTrailID, jTrail);

        this.stopRecording();

        return (this.trailObj.endTime - this.trailObj.startTime);
    }

}
