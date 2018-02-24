import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavParams, ModalController, ViewController } from 'ionic-angular';

import { TrailSet } from '../../models/trailSet';
import { Trail } from '../../models/trail';

import { MapProvider } from '../../providers/map/map';
import { TrailStorageProvider } from '../../providers/trail-storage/trail-storage';


/**
 * Page containing the map for land trailing.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@IonicPage()
@Component({
    selector: 'page-land-map',
    providers: [MapProvider],
    templateUrl: 'land-map.html',
})
export class LandMapPage {

	/**
	 * Method to work on the mapElement in order to display google maps.
	 *
	 * @since 1.0.0
	 */
    @ViewChild('map') mapElement: ElementRef;

    trailSet: TrailSet;
    runnerTrail: Trail;
    dogTrail: Trail;

    showPerson = false;

    hasTrails = false;

    mapLoaded = false;

    startTime: Date;
    deltaTime: Date;
    runTime: string;

    timeInterval: any;

    someString = "Hallo";

    constructor(public navParams: NavParams, public viewCtrl: ViewController, public modalCtrl: ModalController, public map: MapProvider, public storage: TrailStorageProvider) {
        /*
            NOTE: Unterscheiden in Training und Einsatzt. Die Anzeigen ändern sich.
        */
        this.trailSet = TrailSet.fromData(this.navParams.get('trailSet'));

        this.startTime = new Date();
        this.deltaTime = new Date();
    }

	/**
	 * Ionic lifecycle event that is called after the page is loaded to initialize the map.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
    ionViewDidLoad() {
        this.map.initMapObject(this.mapElement);
        if(this.trailSet.trails.length > 0){
            this.map.importTrailSet(this.trailSet);
            this.runnerTrail = this.trailSet.trails[0];
            console.log(this.runnerTrail);
            this.hasTrails = true;
        }
        this.map.startSession();

        this.map.getCurrentTrailSubject().subscribe((data) => {
            this.dogTrail = data;
            this.mapLoaded = true;
        });

        this.startTimer();
    }

    /**
    * Method that is called to stop the recording of a trail.
    *
    * @since 1.0.0
    * @version 1.0.0
    */
    startTimer() {
        this.timeInterval = setInterval((i) => {
            this.deltaTime = new Date();
            this.runTime = new Date(this.deltaTime.getTime() - this.startTime.getTime()).toISOString();
        }, 1000);
    }

    /**
    * Method that is called to stop the recording of a trail.
    *
    * @since 1.0.0
    * @version 1.0.0
    */
    endTimer() {
      clearInterval(this.timeInterval);
    }


	/**
	 * Method that is called to stop the recording of a trail.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	endTrail() {
        this.map.currentTrail.setEndTime();
        this.trailSet.addTrailToSet(this.map.currentTrail);

        console.log(this.trailSet);

        this.storage.addNewTrailSet(this.trailSet);

        this.map.endSession();
        this.endTimer();

        this.viewCtrl.dismiss();
    }

    /**
	 * Method to set the map back in centered mode.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
    centerMap(){
        this.map.centerMap();
    }

    /**
	 * Method to add a end marker incase the dog dismisses the area.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
    addEndMarker(){
        console.log("Added End Marker");
        this.map.addMarker("Some Text", 0);
    }

    /**
     * Method to add a interest marker incase the dog shows interest in the area.
     *
     * @since 1.0.0
     * @version 1.0.0
     */
    addInterestMarker(){
        console.log("Added Interest Marker");
        this.map.addMarker("Some Text", 1);
    }

    /**
     * Method to add a wind direction marker indicating the wind direction in the area.
     *
     * @since 1.0.0
     * @version 1.0.0
     */
    addWindDirectionMarker(){
        //TODO (christian): benutz den FORWARD_CLOSED_ARROW und rotiere ihn!
        //TODO (christian): setze das heading der map anhand von geolocation haeding!
        console.log("WIND DIRECTION MARKER STILL IN DEVELOPMENT!");
    }

}
