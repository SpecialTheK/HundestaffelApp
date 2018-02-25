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

    dogName: string = "";
    trainer: string = "test";
    
    translatedTerms: Array<string> = [];

    person: Person;
	
	hair: string[] = [];
	hairColor: string[] = [];
	body: string[] = [];

    weather_Precipitation: string[] = [];
    weather_WindDirection: string[] = [];
    weather_Temperature: number = 20;

    situation: string = "";
    preSituation: string = "";
    risks: string = "";


    constructor(public navCtrl: NavController, public navParams: NavParams, public translateService: TranslateService) {
        this.translateVariables();
	    this.person = new Person();
        this.person.hairColor_choice = "123";
    }
	
	/**
	 * Method called to translate all variables needed for this page.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	private translateVariables(){
		let translateTerms = Array("MAP_PRECIPITATION_RAIN", "MAP_PRECIPITATION_SNOW", "MAP_PRECIPITATION_SLEET", "MAP_PRECIPITATION_HAIL", "PERSON_HAIR_NONE", "PERSON_HAIR_SHORT", "PERSON_HAIR_MEDIUM", "PERSON_HAIR_LONG", "PERSON_HAIR_BLACK", "PERSON_HAIR_BLOND", "PERSON_HAIR_BLOND_DARK", "PERSON_HAIR_BROWN", "PERSON_HAIR_BROWN_DARK", "PERSON_HAIR_BROWN_LIGHT", "PERSON_HAIR_GREY", "PERSON_HAIR_WHITE", "PERSON_HAIR_RED", "PERSON_BODY_SLIM", "PERSON_BODY_ATHLETIC", "PERSON_BODY_NORMAL", "PERSON_BODY_CORPULENT", "PERSON_BODY_OVERWEIGHT", "MAP_WIND_N", "MAP_WIND_NE", "MAP_WIND_E", "MAP_WIND_SE", "MAP_WIND_S", "MAP_WIND_SW", "MAP_WIND_W", "MAP_WIND_NW", "MAP_PRECIPITATION_NONE");
		for(let term of translateTerms){
			this.translatedTerms[term.toLowerCase()] = "Test123";
		}
		for(let term of translateTerms){
			this.translateService.get(term).subscribe((answer) => {
				this.translatedTerms[term.toLowerCase()] = answer;
			});
		}
		
		this.hair = [
			this.translatedTerms["person_hair_none"],
			this.translatedTerms["person_hair_short"],
			this.translatedTerms["person_hair_medium"],
			this.translatedTerms["person_hair_long"],
		];
		this.hairColor = [
			this.translatedTerms["person_hair_brown"],
			this.translatedTerms["person_hair_brown_dark"],
			this.translatedTerms["person_hair_brown_light"],
			this.translatedTerms["person_hair_blond"],
			this.translatedTerms["person_hair_blond_dark"],
			this.translatedTerms["person_hair_black"],
			this.translatedTerms["person_hair_red"],
			this.translatedTerms["person_hair_grey"],
			this.translatedTerms["person_hair_white"]
		];
		this.body = [
			this.translatedTerms["person_body_slim"],
			this.translatedTerms["person_body_athletic"],
			this.translatedTerms["person_body_normal"],
			this.translatedTerms["person_body_corpulent"],
			this.translatedTerms["person_body_overweight"],
		];
		
		this.weather_Precipitation = [
			this.translatedTerms["map_precipitation_none"],
			this.translatedTerms["map_precipitation_rain"],
			this.translatedTerms["map_precipitation_snow"],
			this.translatedTerms["map_precipitation_sleet"],
			this.translatedTerms["map_precipitation_hail"]
		];
		this.weather_WindDirection = [
			this.translatedTerms["map_wind_n"],
			this.translatedTerms["map_wind_ne"],
			this.translatedTerms["map_wind_e"],
			this.translatedTerms["map_wind_se"],
			this.translatedTerms["map_wind_s"],
			this.translatedTerms["map_wind_sw"],
			this.translatedTerms["map_wind_w"],
			this.translatedTerms["map_wind_nw"]
		];
	}

    gotoMap(){
        let trailSet;
        if(this.navParams.get('isLandTrail')){
            console.log("LAND");
            trailSet = new TrailSet(true, false, true, this.preSituation, this.situation, "wetter", this.risks, this.person);
            this.navCtrl.push('LandMapPage', {trailSet: trailSet});
        }else {
            console.log("WASSER");
            trailSet = new TrailSet(false, false, true, this.preSituation, this.situation, "wetter", this.risks, this.person);
            this.navCtrl.push('WaterMapPage', {trailSet: trailSet});
        }
    }
}
