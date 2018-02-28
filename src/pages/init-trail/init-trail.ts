import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import { TrailSet } from '../../models/trailSet';

/**
 * Page called before starting the recording of a new trail to set a few variables.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@IonicPage()
@Component({
    selector: 'page-init-trail',
    templateUrl: 'init-trail.html',
})
export class InitTrailPage {
    isLandTrail: boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.isLandTrail = this.navParams.get('isLandTrail');
    }
    
    gotoMap(data){
	    let trailSet: TrailSet = new TrailSet(this.isLandTrail, false, true, data.preSituation, data.situation, data.temperature, data.precipitation, data.risks, data.person);
	    if(this.isLandTrail){
		    console.log("LAND");
		    this.navCtrl.push('LandMapPage', {trailSet: trailSet, dog: data.dogs[0]});
	    } else {
		    console.log("WASSER");
		    this.navCtrl.push('WaterMapPage', {trailSet: trailSet, dogs: data.dogs});
	    }
    }
}
