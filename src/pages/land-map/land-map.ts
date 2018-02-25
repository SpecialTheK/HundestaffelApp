import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavParams, ViewController} from 'ionic-angular';

import { TrailSet } from '../../models/trailSet';
import { Trail } from '../../models/trail';

import { MapProvider } from '../../providers/map/map';
import { TrailStorageProvider } from '../../providers/trail-storage/trail-storage';
import {TranslateService} from "@ngx-translate/core";
import {Flashlight} from "@ionic-native/flashlight";
import {AppPreferences} from "@ionic-native/app-preferences";
import {BackgroundMode} from "@ionic-native/background-mode";


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
	dogName: string;
	trainerName: string = "";
    mapLoaded = false;

    startTime: Date;
    deltaTime: Date;
    runTime: string;
    timeInterval: any;

    isRunnerTrail = false;

    translatedTerms: Array<string> = [];


    constructor(public navParams: NavParams,
                public viewCtrl: ViewController,
                public map: MapProvider,
                public storage: TrailStorageProvider,
                public translateService: TranslateService,
                public flashlight: Flashlight,
                public backgroundMode: BackgroundMode,
                appPreferences: AppPreferences) {
        /*
            NOTE: Unterscheiden in Training und Einsatzt. Die Anzeigen ändern sich.
        */
        this.trailSet = TrailSet.fromData(this.navParams.get('trailSet'));
		this.dogName = this.navParams.get('dog');
        if(this.trailSet.trails.length === 0 && this.trailSet.isTraining){
            this.isRunnerTrail = true;
        } else{
            this.isRunnerTrail = false;
        }
        appPreferences.fetch('username').then((answer) => {
        	this.trainerName = answer;
        }).catch((error) => {
        	console.log("Error: "+error);
        });

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
            this.map.startSession(true, this.trainerName, this.dogName);
            this.map.getCurrentTrailSubject().subscribe((data) => {
                this.runnerTrail = data;
                this.mapLoaded = true;
            });
        } else if(!this.trailSet.isTraining){
            this.map.startSession(true, this.trainerName, this.dogName);
            this.map.getCurrentTrailSubject().subscribe((data) => {
                this.dogTrail = data;
                this.mapLoaded = true;
            });
        } else {
            this.map.importTrailSet(this.trailSet);
            //NOTE (christian): dies kann sich im verlauf des Trails ändern, wenn ein anderer Trail im auswahlmenu gewählt wird
            this.runnerTrail = this.trailSet.trails[0];
            this.map.startSession(true, this.trainerName, this.dogName);
            this.map.toggleVirtualTrainer(this.runnerTrail);
            this.map.getCurrentTrailSubject().subscribe((data) => {
                this.dogTrail = data;
                this.mapLoaded = true;
            });
        }
        this.backgroundMode.enable();
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
		this.backgroundMode.disable();
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
        this.map.addMarker(0);
    }

    /**
     * Method to add a interest marker incase the dog shows interest in the area.
     *
     * @since 1.0.0
     * @version 1.0.0
     */
    addInterestMarker(){
        console.log("Added Interest Marker");
        this.map.addMarker(1);
    }

    /**
     * Method to add a wind direction marker indicating the wind direction in the area.
     *
     * @since 1.0.0
     * @version 1.0.0
     */
    addWindDirectionMarker(event){
        console.log("Added Wind Direction Marker");
        //this.map.addMarker("Some Text", -1, 0);
        this.map.setzeWindMarker();
    }
    
    public toggleFlashlight(){
    	if(this.flashlight.available()){
    		this.flashlight.toggle();
	    }
    }
}
