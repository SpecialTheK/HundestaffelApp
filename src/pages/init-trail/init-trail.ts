import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Person } from '../../models/person';
import { TrailSet } from '../../models/trailSet';
import {TranslateService} from "@ngx-translate/core";

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

    dogNames: string[];
    trainer: string = "test";

    translatedTerms: Array<string> = [];

    person: Person;

	hair: string[] = [
		"Kahl",
		"Kurz",
		"Mittellang",
		"Lang"
	];
	hairColor: string[] = [
		"Braun",
		"Dunkelbraun",
		"Hellbraun",
		"Blond",
		"Dunkelblond",
		"Schwarz",
		"Rot",
		"Grau",
		"Weiß"
	];
	body: string[] = [
		"Schlank",
		"Athletisch",
		"Normal",
		"Füllig",
		"Übergewichtig"
	];

    weather_Precipitation: string[] = [
	    this.translatedTerms["MAP_PRECIPITATION_NONE"],
	    this.translatedTerms["MAP_PRECIPITATION_RAIN"],
	    this.translatedTerms["MAP_PRECIPITATION_SNOW"],
	    this.translatedTerms["MAP_PRECIPITATION_SLEET"],
	    this.translatedTerms["MAP_PRECIPITATION_HAIL"]
    ];
    weather_WindDirection: string[] = [
        this.translatedTerms["MAP_WIND_N"],
	    this.translatedTerms["MAP_WIND_NE"],
	    this.translatedTerms["MAP_WIND_E"],
	    this.translatedTerms["MAP_WIND_SE"],
	    this.translatedTerms["MAP_WIND_S"],
	    this.translatedTerms["MAP_WIND_SW"],
	    this.translatedTerms["MAP_WIND_W"],
	    this.translatedTerms["MAP_WIND_NW"]
    ];
    weather_Temperature: number = 20;

    situation: string = "";
    preSituation: string = "";
    risks: string = "";

    isLandTrail: boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams, public translateService: TranslateService) {
        this.isLandTrail = this.navParams.get('isLandTrail');
        this.person = new Person();
        this.dogNames = [];
        this.dogNames.push("");
        this.translateVariables();
    }

	/**
	 * Method called to translate all variables needed for this page.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	private translateVariables(){
		let translateTerms = Array("MAP_WIND_N", "MAP_WIND_NE", "MAP_WIND_E", "MAP_WIND_SE", "MAP_WIND_S", "MAP_WIND_SW", "MAP_WIND_W", "MAP_WIND_NW", "MAP_PRECIPITATION_NONE", "MAP_PRECIPITATION_RAIN", "MAP_PRECIPITATION_SNOW", "MAP_PRECIPITATION_SLEET", "MAP_PRECIPITATION_HAIL");
		for(let term of translateTerms){
			this.translateService.get(term).subscribe((answer) => {
				this.translatedTerms[term.toLowerCase()] = answer;
			});
		}
	}

    customTrackBy(index: number, obj: any): any {
    	return index;
    }

    addDogInput(event, index){
        if(event.value === "" && this.dogNames.length > 1){
            this.dogNames.splice(index, 1);
            if((this.dogNames.length - index) !== 1){
                this.dogNames.push("");
            }
        }else {
            if((this.dogNames.length - index) === 1){
                this.dogNames.push("");
            }
        }
    }

    gotoMap(){
        let trailSet;
        if(this.isLandTrail){
            console.log("LAND");
            trailSet = new TrailSet(true, false, true, this.preSituation, this.situation, "wetter", this.risks, this.person);
            this.navCtrl.push('LandMapPage', {trailSet: trailSet, dog: this.dogNames[0]});
        }else {
            console.log("WASSER");
            this.dogNames.splice((this.dogNames.length - 1), 1);
            trailSet = new TrailSet(false, false, true, this.preSituation, this.situation, "wetter", this.risks, this.person);
            this.navCtrl.push('WaterMapPage', {trailSet: trailSet, dogs: this.dogNames});
        }
    }
}
