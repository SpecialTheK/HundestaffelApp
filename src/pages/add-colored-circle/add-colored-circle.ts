import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

/**
 * Page used to add a new circle to the map.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@IonicPage()
@Component({
    selector: 'page-add-colored-circle',
    templateUrl: 'add-colored-circle.html',
})
export class AddColoredCirclePage {

	/**
	 * The opacity of the new circle.
	 *
	 * @type {number}
	 * @since 1.0.0
	 */
    circleOpacity: number = 8;

    map: any;

    constructor(public navParams: NavParams, public viewCtrl: ViewController) {
        this.map = this.navParams.get('map')
    }

	/**
	 * Method calling the underlying trailObject to add the circle to the cirlces array.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	addCircle() {
        this.map.addCircle((this.circleOpacity/10));
        this.viewCtrl.dismiss();
    }

    hide(){
        this.map.toggleWaterDogTrail(true);
        this.viewCtrl.dismiss();
    }

    show(){
        this.map.toggleWaterDogTrail(false);
        this.viewCtrl.dismiss();
    }

}
