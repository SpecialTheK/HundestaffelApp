import {Component, Input} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {TrailSet} from "../../models/trailSet";
import {Trail} from "../../models/trail";
import moment from "moment";

/**
 * Displays a trailSet in an ion-card.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@Component({
	selector: 'trail-card',
	templateUrl: 'trail-card.html'
})
export class TrailCardComponent {

@Input() trail: TrailSet;
	
	/**
	 * The classes to apply for styling.
	 *
	 * @type {string} The class names.
	 * @since 1.0.0
	 */
	classes: string = "";
	
	/**
	 * Defines the type of an operation.
	 *
	 * @type {string} training or operation.
	 * @since 1.0.0
	 */
	operationType: string = "";
	
	/**
	 * Date when the trail was started
	 *
	 * @type {string}
	 * @since 1.0.0
	 */
	startTime: string = "";
	
	/**
	 * The type of the map used for this trailSet.
	 *
	 * @type {string} either land or water.
	 * @since 1.0.0
	 */
	mapType: string = "";
	
	/**
	 * The amount of trails in this trailSet.
	 * @type {number}
	 * @since 1.0.0
	 */
	trails: number = 0;
	
	/**
	 * Array containing all dogs and their duration in this trailSet.
	 *
	 * @type {any[]}
	 * @since 1.0.0
	 */
	dogs: any = [];
	
	/**
	 * Defines whether this activity was imported or not.
	 *
	 * @type {boolean}
	 * @since 1.0.0
	 */
	isShared: boolean = false;
	
	/**
	 * Array containing all translated terms.
	 *
	 * @type {string[]}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	translatedTerms: Array<string> = [];
	
	constructor(public translate: TranslateService) {
	}
	
	/**
	 * Angular method called when the component is initialized. Ionic lifecylce events don't work inside of components.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	ngOnInit(){
		this.translateVariables();
		this.trails = this.trail.trails.length;
		this.setClasses();
		this.isShared = this.trail.isSharedTrail;
		if(this.trail.trails[0] !== undefined){
			this.startTime = this.trail.trails[0].startTime.toString();
			this.trail.trails.forEach((value: Trail, index:number) => {
				this.dogs.push({name: value.dog, duration: this.getDuration(value.startTime, value.endTime)});
			});
		}
	}
	
	/**
	 * Method called to translate all terms used in this template.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	private translateVariables(){
		let translateTerms = Array("HOURS", "MINUTES", "SECONDS");
		for(let term of translateTerms){
			this.translate.get(term).subscribe((answer) => {
				this.translatedTerms[term.toLowerCase()] = answer;
			});
		}
	}
	
	/**
	 * Method to get the duration between two Date objects using the moment.js library
	 *
	 * @param {Date} startTime
	 * @param {Date} endTime
	 * @returns {string}
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	private getDuration(startTime: Date, endTime: Date):string{
		let _startTime = moment(startTime);
		let _endTime = moment(endTime);
		
		let totalTime = moment(_startTime.diff(_endTime)).toDate();
		return totalTime.getHours()+" "+this.translatedTerms["hours"]+" "+totalTime.getMinutes()+
			" "+this.translatedTerms["minutes"]+" "+" "+totalTime.getMinutes()+" "+this.translatedTerms["seconds"];
	}
	
	/**
	 * This methods sets all classes used for styling of the cards.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	setClasses(){
		if(this.trail.isTraining){
			this.classes = this.classes + ' training';
			this.translate.get('TRAIL_TRAINING').subscribe(value => {
				this.operationType = value;
			});
		} else {
			this.classes = this.classes + ' operation';
			this.translate.get('TRAIL_OPERATION').subscribe(value => {
				this.operationType = value;
			});
		}
		if(this.trail.isLandTrail){
			this.classes = this.classes + ' land-activity';
			this.translate.get('TRAIL_LAND').subscribe(value => {
				this.mapType = value;
			});
		} else {
			this.classes = this.classes + ' water-activity';
			this.translate.get('TRAIL_WATER').subscribe(value => {
				this.mapType = value;
			});
		}
	}
}
