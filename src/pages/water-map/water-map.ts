import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, ModalController, NavParams } from 'ionic-angular';
import { Trail } from '../../models/trail';

import { MapProvider } from '../../providers/map/map';

/**
 * Page that displays the map for water trailing.
 */
@IonicPage()
@Component({
    selector: 'page-water-map',
    providers: [ MapProvider ],
    templateUrl: 'water-map.html',
})
export class WaterMapPage {

	/**
	 * Reference of the mapElement in order to display google maps.
	 *
	 * @since 1.0.0
	 */
    @ViewChild('map') mapElement: ElementRef;

    trails: Trail[] = [];

    constructor(public modalCtrl: ModalController, public navParams: NavParams, public map: MapProvider) {
    }

	/**
	 * Ionic lifecycle events that is fired after the page is loaded to initialize the map.
	 */
	ionViewDidLoad() {
        this.map.initMapObject(this.mapElement);
        this.map.startSession(this.navParams.get('trailSet'));
    }

	/**
	 * Method that is used to toggle the display of an existing trail.
	 *
	 * @param index
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	toggleTail(index){
        /*
        if(this.map.trailArray[index].isHidden){
            this.map.trailArray[index].show();
        }else {
            this.map.trailArray[index].hide();
        }
        */
        console.log(index);
    }

	/**
	 * Method that is called to stop the recording.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	stopRecording() {
        this.map.endSession();
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
	addMarker() {
        let markerAdd = this.modalCtrl.create('AddMarkerPage', {map: this.map});
        markerAdd.present();
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
