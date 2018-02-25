import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, ModalController, NavParams, ViewController, PopoverController } from 'ionic-angular';

import { TrailSet } from "../../models/trailSet";

import { MapProvider } from '../../providers/map/map';
import { TrailStorageProvider } from '../../providers/trail-storage/trail-storage';
import {TranslateService} from "@ngx-translate/core";


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

    constructor(public modalCtrl: ModalController, public navParams: NavParams, public viewCtrl: ViewController, public popCtrl: PopoverController, public map: MapProvider, public storage: TrailStorageProvider, public translateService: TranslateService) {
        this.trailSet = this.navParams.get('trailSet');

        this.trailSet.addTrailToSet(new Trail(this.trailSet.trails.length, "Trainer", "Hund1"));
        this.trailSet.addTrailToSet(new Trail(this.trailSet.trails.length, "Trainer", "Hund2"));
        this.trailSet.addTrailToSet(new Trail(this.trailSet.trails.length, "Trainer", "Hund3"));

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
        this.map.getCurrentTrailSubject().subscribe((data) =>{
            this.dogTrail = data;
            this.mapLoaded = true;
        });
        this.map.getDistanceToTargetMarker().subscribe((data) =>{
            this.distanceToTargetMarker = data;
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

        this.trailSet.addTrailToSet(this.dogTrail);

        console.log(this.trailSet);

        this.storage.addNewTrailSet(this.trailSet);

        this.map.endSession();
        this.endTimer();

        this.viewCtrl.dismiss();
    }

	/**
	 * Method that is called to add a circle to the map.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	addCircle(event: any, index: number) {
        this.map.setWaterDogTrail(this.trailSet.trails[index]);
        let popover = this.popCtrl.create('AddColoredCirclePage', {map: this.map});
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
        this.map.addMarker(this.translatedTerms["map_marker_end"], 0);
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
}
