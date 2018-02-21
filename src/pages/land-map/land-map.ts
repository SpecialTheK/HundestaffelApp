import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavParams, ModalController } from 'ionic-angular';

import { MapProvider } from '../../providers/map/map';

/**
 * Page containing the map for land trailing.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@IonicPage()
@Component({
    selector: 'page-land-map',
    providers: [ MapProvider ],
    templateUrl: 'land-map.html',
})
export class LandMapPage {

	/**
	 * Method to work on the mapElement in order to display google maps.
	 *
	 * @since 1.0.0
	 */
    @ViewChild('map') mapElement: ElementRef;

    constructor(public navParams: NavParams, public modalCtrl: ModalController, public map: MapProvider) {
    }

	/**
	 * Ionic lifecycle event that is called after the page is loaded to initialize the map.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	ionViewDidLoad() {
        this.map.initMapObject(this.mapElement);
    }

	/**
	 * Method to show the current position of the user.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	showCurrentLocation(){
        //TODO (christian): erstelle eine button zum centern des views!
        //this.map.recordCurrentPosition();
    }

	/**
	 * Method that is called to stop the recording of a trail.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	stopRecording() {
        this.map.endSession();
    }

	/**
	 * Method that is called to add a new marker to the map.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	addMarker() {
        //console.log("Added Marker");
        //this.map.addMarker();

        let markerAdd = this.modalCtrl.create('AddMarkerPage', {map: this.map});
        markerAdd.present();
    }
}
