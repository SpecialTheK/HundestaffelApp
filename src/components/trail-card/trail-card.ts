import {Component, Input} from '@angular/core';
import {Trail} from "../../models/trail";
import {TranslateService} from "@ngx-translate/core";

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

@Input() trail: Trail[];
	
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
	
	constructor(public translate: TranslateService) {
	}
	
	/**
	 * Angular method called when the component is initialized. Ionic lifecylce events don't work inside of components.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	ngOnInit(){
		this.trails = this.trail.length;
		this.setClasses();
		this.isShared = this.trail[0].isSharedActivity;
		this.startTime = this.trail[0].startTime.toString();
		this.trail.forEach((value: Trail, index:number) => {
			this.dogs.push({name: value.dog, duration: (value.endTime-value.startTime)});
		});
	}
	
	/**
	 * This methods sets all classes used for styling of the cards.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	setClasses(){
		if(this.trail[0].isTraining){
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
		if(this.trail[0].isLandActivity){
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
