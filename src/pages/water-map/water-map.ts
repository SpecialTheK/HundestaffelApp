import { Component, ViewChild, ElementRef } from '@angular/core';
import {IonicPage, NavParams, NavController, PopoverController, ModalController} from 'ionic-angular';

import { TrailSet } from "../../models/trailSet";

import { MapProvider } from '../../providers/map/map';
import { TrailStorageProvider } from '../../providers/trail-storage/trail-storage';
import {TranslateService} from "@ngx-translate/core";
import {Trail} from "../../models/trail";
import {Flashlight} from "@ionic-native/flashlight";
import {AppPreferences} from "@ionic-native/app-preferences";
import {BackgroundMode} from "@ionic-native/background-mode";
import {DetailsFormComponent} from "../../components/details-form/details-form";

import {DogListComponent} from '../../components/dog-list/dog-list';
import {ImagePopupComponent} from "../../components/image-popup/image-popup";

/**
 * Page that displays the map for water trailing.
 */
@IonicPage()
@Component({
    selector: 'page-water-map',
    providers: [MapProvider],
    templateUrl: 'water-map.html',
})
export class WaterMapPage {

	/**
	 * Reference of the mapElement in order to display google maps.
	 *
	 * @since 1.0.0
	 */
    @ViewChild('map') mapElement: ElementRef;

    trailSet: TrailSet;

    dogTrail: Trail;

    distanceToTargetMarker: number;

    startTime: Date;
    deltaTime: Date;
    runTime: string;
    timeInterval: any;

    displayOpacityMin: number;

    mapLoaded = false;

    translatedTerms:Array<string> = [];

    constructor(public navParams: NavParams,
                public navCtrl: NavController,
                public modalCtrl: ModalController,
                public popCtrl: PopoverController,
                public map: MapProvider,
                public storage: TrailStorageProvider,
                public translateService: TranslateService,
                public flashlight: Flashlight,
                public backgroundMode: BackgroundMode,
                appPreferences: AppPreferences) {

        this.trailSet = this.navParams.get('trailSet');
        let dogs = this.navParams.get('dogs') as string[];
	    appPreferences.fetch('username').then((answer) => {
		    dogs.forEach((dog) => {
                let dt = new Trail(this.trailSet.trails.length, answer, dog)
                dt.setStartTime();
                this.trailSet.addTrailToSet(dt);
		    });
	    }).catch((error) => {
		    console.log("Error: "+error);
		    dogs.forEach((dog) => {
                let dt = new Trail(this.trailSet.trails.length, "Trainer", dog)
                dt.setStartTime();
                this.trailSet.addTrailToSet(dt);
		    });
	    });

        this.distanceToTargetMarker = 0;
        this.displayOpacityMin = 2;

        this.startTime = new Date();
        this.deltaTime = new Date();
        this.runTime = new Date(this.deltaTime.getTime() - this.startTime.getTime()).toISOString();

        this.translateVariables();
    }

	/**
	 * Method called to translate all variables needed for this page.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	private translateVariables(){
		let translateTerms = Array("MAP_MARKER_END");
		for(let term of translateTerms){
			this.translateService.get(term).subscribe((answer) => {
				this.translatedTerms[term.toLowerCase()] = answer;
			});
		}
	}

	/**
	 * Ionic lifecycle events that is fired after the page is loaded to initialize the map.
	 */
	ionViewDidLoad() {
        this.map.initMapObject(this.mapElement);
        if(this.trailSet.trails.length > 0){
            this.map.importTrailSet(this.trailSet);
        }
        this.map.startSession(false);

        this.backgroundMode.enable();

        this.map.getCurrentTrailSubject().subscribe((data) =>{
            this.dogTrail = data;
            this.mapLoaded = true;
        });

        if(!this.trailSet.isLandTrail){
            this.map.getDistanceToTargetMarker().subscribe((data) =>{
                this.distanceToTargetMarker = data;
            });
            this.map.getWaterDogTrailSubject().subscribe((data) => {
                this.trailSet.trails[data.id] = data;
            });
        }

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
    * Method that is called to stop the timer.
    *
    * @since 1.0.0
    * @version 1.0.0
    */
    endTimer() {
      clearInterval(this.timeInterval);
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
	 * Method that is called to stop the recording of a trail.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	endTrail() {
        this.dogTrail.setEndTime();
        this.dogTrail.id = this.trailSet.trails.length;
        this.dogTrail.dog = "Hunde";
        this.dogTrail.trainer = "Trainer";

        this.trailSet.trails.forEach((data) =>{
            data.setEndTime();
        })

        this.trailSet.addTrailToSet(this.dogTrail);

        console.log(this.trailSet);

        this.storage.addNewTrailSet(this.trailSet);

        this.map.endSession();
        this.endTimer();
		this.backgroundMode.disable();
	    this.navCtrl.popToRoot().then((answer) => {
		    this.navCtrl.push('HistoryPage');
	    });
    }

    showDogOptions(event){
        let popover = this.popCtrl.create(DogListComponent, {trails: this.trailSet.trails, map: this.map});
        popover.present({
            ev: event
        });
    }

	/**
	 * Method that is called to add a marker to the map.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	addTargetMarker() {
        this.map.addMarker(0);
    }

	/**
	 * Method that is called to add a triangle to the map.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	addWindDirectionTriangle() {
        this.map.addTriangle();
    }

	/**
	 * Method that is called to change the opacity of an object.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	changeDisplayOpacity() {
        this.trailSet.trails.forEach((data) => {
            data.circles.forEach((cir) => {
                if(cir.opacity < (this.displayOpacityMin / 10)){
                    cir.toggle(null);
                }else {
                    cir.toggle(this.map.mapObject);
                }
            });
        });
    }

	public toggleFlashlight(){
		if(this.flashlight.available()){
			this.flashlight.toggle();
		}
	}

	public editDetails(){
		let data: any = this.trailSet;
		data.dogs = [];
		for(let dog of this.trailSet.trails){
			data.dogs.push(dog.dog);
		}
		let profileModal = this.modalCtrl.create(DetailsFormComponent, {data: data, isLandTrail: false});
		profileModal.present();
		profileModal.onDidDismiss((data) => {
			this.trailSet.precipitation = data.precipitation;
			this.trailSet.temperature = data.temperature;
			this.trailSet.person = data.person;
			this.trailSet.situation = data.situation;
			this.trailSet.preSituation = data.preSituation;
			this.trailSet.risks = data.risks;
			for(let dogId in data.dogs){
				this.trailSet.trails[dogId].dog = data.dogs[dogId];
			}
		});
	}
	
	public showImage(){
		let imageModal = this.modalCtrl.create(ImagePopupComponent, {source: this.trailSet.person.image});
		imageModal.present();
	}
}
