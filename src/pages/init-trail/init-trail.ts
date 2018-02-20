import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Person } from '../../models/person';
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

    dogName: string = "";
    trainer: string = "test";

    person: Person;

    weather_Precipitation: string[] = [
        "Keiner",
        "Regen",
        "Schnee",
        "Graupel",
        "Hagel"
    ];
    weather_WindDirection: string[] = [
        "N",
        "NO",
        "O",
        "SO",
        "S",
        "SW",
        "W",
        "NW"
    ];
    weather_Temperature: number = 20;

    situation: string = "";
    preSituation: string = "";
    risks: string = "";


    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.person = new Person();
    }

    gotoMap(){
        let trailSet;
        if(this.navParams.get('isLandTrail')){
            console.log("LAND");
            trailSet = new TrailSet(this.person, true, this.situation, this.preSituation, this.risks, this.trainer, this.dogName);
            this.navCtrl.push('LandMapPage', {trailSet: trailSet});
        }else {
            console.log("WASSER");
            trailSet = new TrailSet(this.person, false, this.situation, this.preSituation, this.risks, this.trainer, this.dogName);
            this.navCtrl.push('WaterMapPage', {trailSet: trailSet});
        }
    }

}
