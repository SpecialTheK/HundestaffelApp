import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavParams, ModalController, ViewController, PopoverController } from 'ionic-angular';

import { TrailSet } from '../../models/trailSet';
import { Trail } from '../../models/trail';

import { MapProvider } from '../../providers/map/map';
import { TrailStorageProvider } from '../../providers/trail-storage/trail-storage';
import {TranslateService} from "@ngx-translate/core";


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

    mapLoaded = false;

    startTime: Date;
    deltaTime: Date;
    runTime: string;
    timeInterval: any;

    isRunnerTrail = false;

    translatedTerms: Array<string> = [];

  
    constructor(public navParams: NavParams, public viewCtrl: ViewController, public popCtrl: PopoverController, public modalCtrl: ModalController, public map: MapProvider, public storage: TrailStorageProvider, public translateService: TranslateService) {
        /*
            NOTE: Unterscheiden in Training und Einsatzt. Die Anzeigen ändern sich.
        */
        this.trailSet = TrailSet.fromData(this.navParams.get('trailSet'));

        if(this.trailSet.trails.length === 0 && this.trailSet.isTraining){
            this.isRunnerTrail = true;
        } else{
            this.isRunnerTrail = false;
        }

        this.startTime = new Date();
        this.deltaTime = new Date();
        this.translateVariables();
    }

	/**
	 * Ionic lifecycle event that is called after the page is loaded to initialize the map.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
    ionViewDidLoad() {
        console.log(this.isRunnerTrail);

        this.map.initMapObject(this.mapElement);
        if(this.isRunnerTrail){
            this.map.startSession(true);
            this.map.getCurrentTrailSubject().subscribe((data) => {
                this.runnerTrail = data;
                this.mapLoaded = true;
            });
        } else if(!this.trailSet.isTraining){
            this.map.startSession(true);
            this.map.getCurrentTrailSubject().subscribe((data) => {
                this.dogTrail = data;
                this.mapLoaded = true;
            });
        } else {
            this.map.importTrailSet(this.trailSet);
            //NOTE (christian): dies kann sich im verlauf des Trails ändern, wenn ein anderer Trail im auswahlmenu gewählt wird
            this.runnerTrail = this.trailSet.trails[0];
            this.map.startSession(true);
            this.map.toggleVirtualTrainer(this.runnerTrail);
            this.map.getCurrentTrailSubject().subscribe((data) => {
                this.dogTrail = data;
                this.mapLoaded = true;
            });
        }
        this.startTimer();
    }
	
	/**
	 * Method called to translate all variables needed for this page.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	private translateVariables(){
		let translateTerms = Array("MAP_MARKER_END", "MAP_MARKER_INTEREST");
		for(let term of translateTerms){
			this.translateService.get(term).subscribe((answer) => {
				this.translatedTerms[term.toLowerCase()] = answer;
			});
		}
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
    * Method that is called to stop the timer.
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
        this.map.addMarker(this.translatedTerms["map_marker_end"], 0);
    }

    /**
     * Method to add a interest marker incase the dog shows interest in the area.
     *
     * @since 1.0.0
     * @version 1.0.0
     */
    addInterestMarker(){
        console.log("Added Interest Marker");
        this.map.addMarker(this.translatedTerms["map_marker_interest"], 1);
    }

    /**
     * Method to add a wind direction marker indicating the wind direction in the area.
     *
     * @since 1.0.0
     * @version 1.0.0
     */
    addWindDirectionMarker(event){
        console.log("Added Wind Direction Marker");
        this.map.addMarker("Some Text", -1, 0);
        let lastMarker = this.map.currentTrail.marker[this.map.currentTrail.marker.length - 1];
        let popover = this.popCtrl.create('WindmarkerOrientationPage', {marker: lastMarker});
        popover.present({ev: event});
    }

}
