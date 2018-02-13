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
        this.map = new google.maps.Map(mapElement.nativeElement, {
            disableDoubleClickZoom: true,
            zoom: 16
        });
        this.map.addListener('click', (i) => {
            console.log(i.latLng.toJSON());
        });

        this.location.getCurrentPosition().then((pos) => {
            this.map.panTo({lat: pos.coords.latitude, lng: pos.coords.longitude});
        });
        //this.startEmptySession();
    }

    /**
    * Starts a new session
    */
    startSession(trainerName: string, dogName: string, isLand: boolean, isShared: boolean, isTrain: boolean) {
        this.currentTrail = new Trail(trainerName, dogName, isLand, isShared, isTrain);
        this.recordCurrentPosition();
    }

    /**
    * Starts a new session
    */
    startExistingSession(trailSet, trainerName: string, dogName: string, isLand: boolean, isShared: boolean, isTrain: boolean) {
        this.startSession(trainerName, dogName, isLand, isShared, isTrain);
        for(let trail of trailSet.t){
            this.loadTrail(trail);
        }
    }

    /**
    * Starts a new session
    */
    viewExistingSession(trailSet) {

    }

    loadTrail(trail: Trail) {
        this.currentTrail = new Trail(trail.trainer, trail.dog, trail.isLandActivity, trail.isSharedActivity, trail.isTraining);
        for(let pat of trail.path){
            this.currentTrail.addToPath(new Position(pat.lat, pat.lng));
        }
        for(let cir of trail.circles){
            this.addColoredCircle(cir.color, cir.opacity);
        }
        for(let mar of trail.marker){
            this.addMarker(mar.title, mar.symbolID);
        }
        for(let tri of trail.triangles){
            this.addTriangle();
        }
        console.log(this.currentTrail.convertToSimpleObject());
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

        this.storage.set(this.startTime.toString(), JSON.stringify(this.currentTrail.convertToSimpleObject()));

        this.stopRecording();
    }

}
