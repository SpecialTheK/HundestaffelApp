import { Component, ViewChild, ElementRef } from '@angular/core';
import {Events, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';

import { TrailSet } from '../../models/trailSet';
import { Trail } from '../../models/trail';

import { MapProvider } from '../../providers/map/map';
import { TrailStorageProvider } from '../../providers/trail-storage/trail-storage';
import {TranslateService} from "@ngx-translate/core";
import {Flashlight} from "@ionic-native/flashlight";
import {AppPreferences} from "@ionic-native/app-preferences";
import {BackgroundMode} from "@ionic-native/background-mode";
import {DetailsFormComponent} from "../../components/details-form/details-form";
import {ImagePopupComponent} from "../../components/image-popup/image-popup";


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
    runTime: number;
    timeInterval: any;

    isRunnerTrail = false;

    translatedTerms: Array<string> = [];


    constructor(public navParams: NavParams,
                public navCtrl: NavController,
                public modalCtrl: ModalController,
                public map: MapProvider,
                public storage: TrailStorageProvider,
                public translateService: TranslateService,
                public flashlight: Flashlight,
                public backgroundMode: BackgroundMode,
                public events: Events,
                appPreferences: AppPreferences) {
        /*
            NOTE: Unterscheiden in Training und Einsatzt. Die Anzeigen ändern sich.
        */
        this.trailSet = TrailSet.fromData(this.navParams.get('trailSet'));
		this.dogName = this.navParams.get('dog');
        this.isRunnerTrail = this.trailSet.trails.length === 0 && this.trailSet.isTraining;
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
            this.runTime = new Date(this.deltaTime.getTime() - this.startTime.getTime()).getTime();
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
		this.navCtrl.popToRoot().then((answer) => {
			this.navCtrl.push('HistoryPage');
		});
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

    public editDetails(){
    	let data:any = this.trailSet;
    	data.dogs = [this.dogName];
	    let detailModal = this.modalCtrl.create(DetailsFormComponent, {data: data, isLandTrail: true});
	    detailModal.present();
	
	    this.events.subscribe('detailsForm:editSubmitted', (date) => {
	    	this.dogName = data.dogs[0];
	    	this.trailSet.precipitation = data.precipitation;
	    	this.trailSet.temperature = data.temperature;
	    	this.trailSet.person = data.person;
	    	this.trailSet.situation = data.situation;
	    	this.trailSet.preSituation = data.preSituation;
	    	this.trailSet.risks = data.risks;
	    	detailModal.dismiss();
	    });
    }

    public showImage(){
	    let imageModal = this.modalCtrl.create(ImagePopupComponent, {source: this.trailSet.person.image});
	    imageModal.present();
    }
}
