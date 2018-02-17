import {Component, Input} from '@angular/core';
import {Trail} from "../../models/trail";
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the TrailCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
	selector: 'trail-card',
	templateUrl: 'trail-card.html'
})
export class TrailCardComponent {

@Input() trail: Trail[];
	
	classes: string = "";
	operationType: string = "";
	startTime: string = "";
	mapType: string = "";
	trails: number = 0;
	dogs: any = [];
	isShared: boolean = false;
	
	constructor(public translate: TranslateService) {
	}
	
	ngOnInit(){
		this.trails = this.trail.length;
		this.setClasses();
		this.isShared = this.trail[0].isSharedActivity;
		this.startTime = this.trail[0].startTime.toString();
		this.trail.forEach((value: Trail, index:number) => {
			this.dogs.push({name: value.dog, duration: (value.endTime-value.startTime)});
		});
	}
	
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
