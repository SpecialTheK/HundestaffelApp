import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, ModalController, NavParams, ViewController } from 'ionic-angular';

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

    showPerson = false;

    hasTrails = false;
    
    translatedTerms:Array<string> = [];

    constructor(public modalCtrl: ModalController, public navParams: NavParams, public viewCtrl: ViewController, public map: MapProvider, public storage: TrailStorageProvider, public translateService: TranslateService) {
        /*
            NOTE: Unterscheiden in Training und Einsatzt. Die Anzeigen ändern sich.
        */
        this.trailSet = this.navParams.get('trailSet');
        if(this.trailSet !== undefined){
            this.showPerson = true;
        }else {
            this.hasTrails = true;
        }
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
        if(this.hasTrails){
            this.map.importTrailSet(this.trailSet);
        }
        this.map.startSession();
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
        this.map.currentTrail.setEndTime();
        this.trailSet.addTrailToSet(this.map.currentTrail);

        console.log(this.trailSet);

        this.storage.addNewTrailSet(this.trailSet);

        this.map.endSession();

        this.viewCtrl.dismiss();
    }

	/**
	 * Method that is called to add a circle to the map.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	addCircle() {
        let cricleAdd = this.modalCtrl.create('AddColoredCirclePage', {map: this.map});
        cricleAdd.present();
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
	addTriangle() {
        this.map.addTriangle();
    }

	/**
	 * Method that is called to change the opacity of an object.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	changeOpacity() {

    }
}
