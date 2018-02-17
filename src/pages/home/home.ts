import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Page first called when the app is loaded. Just use for navigating
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    constructor(public navCtrl: NavController) {
    }
	
	/**
	 * Method to visit the map page for land trailing.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	gotoLandMap() {
        this.navCtrl.push('LandMapPage');
    }
	
	/**
	 * Method to visit the map page for water trailing.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	gotoWaterMap() {
        this.navCtrl.push('WaterMapPage');
    }
	
	/**
	 * Method to visit the history page containing all previus trailSets.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	gotoHistory() {
    	this.navCtrl.push('HistoryPage')
    }
}
