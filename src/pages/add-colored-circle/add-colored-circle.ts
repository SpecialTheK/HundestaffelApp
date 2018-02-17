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
	
	/**
	 * The color of the new circle.
	 *
	 * @type {string}
	 * @since 1.0.0
	 */
	circleColor: string = '#ff0000';

    constructor(public navParams: NavParams, public viewCtrl: ViewController) {
    }
	
	/**
	 * Method to change the color of the circle.
	 *
	 * @param color The new color.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	changeColor(color){
        this.circleColor = color;
    }
	
	/**
	 * Method calling the underlying trailObject to add the circle to the cirlces array.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	addCircle() {
        this.navParams.get('map').addColoredCircle(this.circleColor, (this.circleOpacity/10));
        this.viewCtrl.dismiss();
    }

}
