import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';

import { Position } from '../../models/position';
import { ColoredCircle } from '../../models/coloredCircle';
import { Marker } from '../../models/marker';
import { Triangle } from '../../models/triangle';
import { Trail } from '../../models/trail';

declare let google: any;

@Injectable()
export class MapProvider {

    map: any;
    recordInterval: any;

    startTime: number = 0;
    endTime: number = 0;

    trail: Trail[] = [];
    currentTrail: Trail;

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
            this.map.addListener('click', (i) => {
                console.log(i.latLng.toJSON());
            });
        });
        this.startEmptySession();
    }

    /**
    * Starts a new session
    */
    startEmptySession() {
        this.currentTrail = new Trail('Jonas', 'Hund1', false, false, false);
        this.recordCurrentPosition();
    }

    /**
    * Starts a new session
    */
    startExistingSession(trail: Trail) {

        this.recordCurrentPosition();
    }

    /**
    * Starts a new session
    */
    viewExistingSession(trail: Trail) {

    }

    /**
    * Starts recording the current position on a set interval of 2 seconds
    */
    recordCurrentPosition() {
        this.recordInterval = setInterval((i) => {
            this.location.getCurrentPosition().then((pos) => {
                this.currentTrail.addToPath(new Position(pos.coords.latitude, pos.coords.longitude));
                if(this.startTime === 0){
                    this.startTime = pos.timestamp;
                }else {
                    this.endTime= pos.timestamp;
                }
                console.log(pos);
            })
        }, 2000);
    }

    /**
    * Stops the recording of the current position
    */
    stopRecording() {
        //console.log(this.timeEndRecording - this.timeStartRecording);
        clearInterval(this.recordInterval);
    }

    /**
    * Returns the last recorded position
    */
    getCurrentPosition(): Position {
        return this.currentTrail.path[this.currentTrail.path.length - 1];
    }

    /**
    * Adds a marker at your current position
    */
    addMarker(markerText, symbolID) {
        if(this.currentTrail.path.length >= 1){
            let marker = new Marker(google, this.map, this.currentTrail.marker.length, this.getCurrentPosition(), markerText, symbolID);
            this.currentTrail.addToMarker(marker);
        }
    }

    /**
    * Adds a colored circle at your current position
    */
    addColoredCircle(color, opacity) {
        if(this.currentTrail.path.length >= 1){
            let circle = new ColoredCircle(google, this.map, this.currentTrail.circles.length, this.getCurrentPosition(), color, opacity);
            this.currentTrail.addToCircles(circle);
        }
    }

    /**
    * Adds a triangle at your current position
    * TODO: add a triangle at the position the user tapped on
    */
    addTriangle() {
        if(this.currentTrail.path.length >= 1){
            let triangle = new Triangle(google, this.map, this.currentTrail.triangles.length, this.getCurrentPosition());
            this.currentTrail.addToTriangles(triangle);
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
        this.currentTrail.setStartTime(this.startTime);
        this.currentTrail.setEndTime(this.endTime);

        let jTrail = {
            t: []
        };

        this.trail.push(this.currentTrail);
        for(let t of this.trail){
            jTrail.t.push(t.convertToSimpleObject());
        }

        this.storage.set(this.startTime.toString(), JSON.stringify(jTrail));

        this.stopRecording();
    }

}
