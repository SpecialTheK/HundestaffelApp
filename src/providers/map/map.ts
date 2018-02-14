import { Injectable } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { TrailStorageProvider } from '../../providers/trail-storage/trail-storage';

import { Position } from '../../models/position';
import { Trail } from '../../models/trail';

declare let google: any;

@Injectable()
export class MapProvider {

    map: any;
    recordInterval: any;

    startTime: number = 0;
    endTime: number = 0;

    trailArray: Trail[] = [];
    currentTrail: Trail;

    constructor(public navParams: NavParams, public location: Geolocation, public storage: TrailStorageProvider) {
        console.log("INIT: MapProvider");
    }

    initMap(mapElement) {
        this.map = new google.maps.Map(mapElement.nativeElement, {
            disableDoubleClickZoom: true,
            disableDefaultUI: true,
            fullscreenControl: false,
            streetViewControl: false,
            zoomControl: true,
            zoom: 16
        });
        this.map.addListener('click', (i) => {
            console.log(i.latLng.toJSON());
        });
        this.location.getCurrentPosition().then((pos) => {
            this.map.panTo({lat: pos.coords.latitude, lng: pos.coords.longitude});
        });
    }

    /**
    * Starts a new session
    */
    startSession(trainerName: string, dogName: string, isLand: boolean, isShared: boolean, isTrain: boolean) {
        this.currentTrail = new Trail(this.trailArray.length, trainerName, dogName, isLand, isShared, isTrain);
        this.currentTrail.init(google, this.map);
        this.recordCurrentPosition();
    }

    /**
    * Starts a new session
    *
    *   TODO: Ist es besser den trailSet key oder das gesamte Set zu übergeben?
    */
    startExistingSession(trailSetKey: string, trainerName: string, dogName: string, isLand: boolean, isShared: boolean, isTrain: boolean) {
        let temp = this.navParams.get('trailSet');
        for(let trail of temp){
            this.loadTrail(trail);
        }
        this.startSession(trainerName, dogName, isLand, isShared, isTrain);
    }

    /**
        Just some testing shit
    */
    addToTrailArray(){
        this.trailArray.push(this.currentTrail);
        this.currentTrail = new Trail(this.trailArray.length, "trainerName", "dogName", false, false, false);
        console.log(this.trailArray);
    }

    loadTrail(trail: Trail) {
        let exTrail = new Trail(this.trailArray.length, trail.trainer, trail.dog, trail.isLandActivity, trail.isSharedActivity, trail.isTraining);
        exTrail.init(google, this.map);
        exTrail.importTrail(trail);

        this.trailArray.push(exTrail);

        //Just for testing
        console.log(exTrail.convertToSimpleObject());
    }

    /**
    * Starts recording the current position on a set interval of 2 seconds
    */
    recordCurrentPosition() {
        this.recordInterval = setInterval((i) => {
            this.location.getCurrentPosition().then((pos) => {
                this.currentTrail.addToPath(pos.coords.latitude, pos.coords.longitude);
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
        clearInterval(this.recordInterval);
    }

    /**
    * Returns the last recorded position
    */
    getCurrentPosition(): Position {
        return this.currentTrail.getLastPos();
    }

    /**
    * Adds a marker at your current position
    */
    addMarker(markerText: string, symbolID: number) {
        if(this.currentTrail.path.length >= 1){
            this.currentTrail.addToMarker(markerText, symbolID);
        }
    }

    /**
    * Adds a colored circle at your current position
    */
    addColoredCircle(color: string, opacity: number) {
        if(this.currentTrail.path.length >= 1){
            this.currentTrail.addToCircles(color, opacity);
        }
    }

    /**
    * Adds a triangle at your current position
    * TODO: add a triangle at the position the user tapped on
    */
    addTriangle() {
        if(this.currentTrail.path.length >= 1){
            this.currentTrail.addToTriangles();
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
    *
    * TODO: Save the entire trail (currentTrail + trailArray)
    */
    endSession(): any {
        this.currentTrail.setStartTime(this.startTime);
        this.currentTrail.setEndTime(this.endTime);

        console.log(this.currentTrail.startTime.toString());

        this.storage.addNewTrailSet(this.currentTrail);

        this.stopRecording();
    }

}
