import { Injectable } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { TrailStorageProvider } from '../../providers/trail-storage/trail-storage';
import {Observable} from "rxjs/Observable";

import { Position } from '../../models/position';
import { Trail } from '../../models/trail';

declare let google: any;

/**
 * Provider that handles displaying the map.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@Injectable()
export class MapProvider {

    map: any;
	
	/**
	 * Interval which is used while recording the position of the device.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	recordInterval: any;
	
	/**
	 * Defines whether the trailSet has multiple trails.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
    hasMultipleTrails: boolean;
	
	/**
	 * Defines whether a triangle is being modified.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	istriangleAddMode: boolean;
	
	/**
	 * Time at which the recording stated.
	 *
	 * @type {number}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
    startTime: number = 0;
	
	/**
	 * Time at which the recording was stopped.
	 *
	 * @type {number}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	endTime: number = 0;
	
	/**
	 * Array containing all trails of the trailSet.
	 *
	 * @type {any[]}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
    trailArray: Trail[] = [];
	
	/**
	 * The current trail that is written to.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	currentTrail: Trail;

    constructor(public navParams: NavParams, public location: Geolocation, public storage: TrailStorageProvider) {
        console.log("INIT: MapProvider");
    }
	
	/**
	 * Called to initialize and display the map.
	 *
	 * @param mapElement
	 * @since 1.0.0
	 * @version 1.0.0
	 */
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

            if(this.istriangleAddMode){
                let pos = new Position(i.latLng.toJSON().lat, i.latLng.toJSON().lng);
                console.log(pos);
                this.currentTrail.addToTriangles(pos);
                this.istriangleAddMode = false;
            }

        });
        this.location.getCurrentPosition().then((pos) => {
            this.map.panTo({lat: pos.coords.latitude, lng: pos.coords.longitude});
        });
    }

    /**
    * Starts a new session
    *
    * @since 1.0.0
    * @version 1.0.0
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
    *   @since 1.0.0
    * @version 1.0.0
    */
    startExistingSession(trainerName: string, dogName: string, isLand: boolean, isShared: boolean, isTrain: boolean) {
        this.hasMultipleTrails = true;
        let temp = this.navParams.get('trailSet');
        for(let trail of temp){
            this.loadTrail(trail);
        }
        this.startSession(trainerName, dogName, isLand, isShared, isTrain);
    }
	
	/**
	 * Method called to display an existing trail.
	 * @param trailSet
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	viewExistingSession(trailSet){
        this.map.setClickableIcons(false);
        for(let trail of trailSet){
            this.loadTrail(trail);
        }
    }
	
	/**
	 * Method called to display an existing trail.
	 * @param {Trail} trail
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
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
    *
    * @since 1.0.0
    * @version 1.0.0
    */
    recordCurrentPosition() {
        /*
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
        */
        this.location.watchPosition().subscribe(data =>{
            console.log("GEOPOSITION: " + JSON.stringify(data));
            this.currentTrail.addToPath(data.coords.latitude, data.coords.longitude);
        });
    }

    /**
     * Stops the recording of the current position
     *
     * @since 1.0.0
     * @version 1.0.0
    */
    stopRecording() {
        clearInterval(this.recordInterval);
    }

    /**
     * Returns the last recorded position
     *
     * @since 1.0.0
     * @version 1.0.0
    */
    getCurrentPosition(): Position {
        return this.currentTrail.getLastPos();
    }

    /**
     * Adds a marker at your current position
     *
     * @since 1.0.0
     * @version 1.0.0
    */
    addMarker(markerText: string, symbolID: number) {
        if(this.currentTrail.path.length >= 1){
            this.currentTrail.addToMarker(markerText, symbolID);
        }
    }

    /**
     * Adds a colored circle at your current position
     *
     * @since 1.0.0
     * @version 1.0.0
    */
    addColoredCircle(color: string, opacity: number) {
        if(this.currentTrail.path.length >= 1){
            this.currentTrail.addToCircles(color, opacity);
        }
    }

    /**
     * Adds a triangle at your current position
     * TODO: add a triangle at the position the user tapped on
     *
     * @since 1.0.0
     * @version 1.0.0
    */
    addTriangle() {
        if(this.currentTrail.path.length >= 1){
            if(this.istriangleAddMode){
                this.istriangleAddMode = false;
            }else {
                this.istriangleAddMode = true;
            }
        }
    }

    /**
    * Returns a list of all trails displayed on the map
    */
    getDisplayedTrails(){
        return new Observable<Trail[]>( observ =>{
            let allTrails = this.trailArray;
            allTrails.push(this.currentTrail);
            observ.next(allTrails);
        });
    }

    /**
     * Changes the display level of the displayed circles
     *
     * @since 1.0.0
     * @version 1.0.0
    */
    changeCircleLevelDisplay(level) {
        // TODO: Faaaak!
    }

    /**
     * Ends the current session of the map
     *
     * @since 1.0.0
     * @version 1.0.0
    */
    endSession(): any {
        this.currentTrail.setStartTime(this.startTime);
        this.currentTrail.setEndTime(this.endTime);

        if(this.hasMultipleTrails){
            this.storage.addTrailToSet(this.trailArray[0].startTime.toString(), this.currentTrail);
        } else {
            this.storage.addNewTrailSet(this.currentTrail);
        }

        this.stopRecording();
    }
}
