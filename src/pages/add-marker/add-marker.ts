import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

/**
 * Page to add a new marker to the map.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@IonicPage()
@Component({
  selector: 'page-add-marker',
  templateUrl: 'add-marker.html',
})
export class AddMarkerPage {
	
	/**
	 * Text of the new marker.
	 *
	 * @type {string}
	 * @since 1.0.0
	 */
    markerText: string = 'test1';
	
	/**
	 * Symbol ID of the new marker.
	 *
	 * @type {number}
	 * @since 1.0.0
	 */
	symbolID: number = 0;

    constructor(public navParams: NavParams, public viewCtrl: ViewController) {
    }
	
	/**
	 * Method calling the underlying trailObject to add the marker to the markersArray.
	 */
	addMarker() {
        this.navParams.get('map').addMarker(this.markerText, this.symbolID);
        this.viewCtrl.dismiss();
    }

}
