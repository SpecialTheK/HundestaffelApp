import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Trail} from "../../models/trail";
import {TranslateService} from "@ngx-translate/core";
import {NavController, PopoverController} from "ionic-angular";
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage";
import {FilterComponent} from "../filter/filter";

/**
 * Generated class for the TrailListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
	selector: 'trail-list',
	templateUrl: 'trail-list.html'
})
export class TrailListComponent {
	@Input() showFilters: boolean = false;
	@Output() cardSelected = new EventEmitter()
	
	trails: Trail[][] = [];
	originalTrails: Trail[][] = [];
	showTrainings: boolean = true;
	showOperations: boolean = true;
	showWaterTrails: boolean = true;
	showLandTrails: boolean = true;
	
	constructor(public navCtrl: NavController, public storage: TrailStorageProvider, public translate: TranslateService, public popoverCtrl: PopoverController) {
		this.storage.getTrailSets().subscribe((value:Trail[]) => {
			this.trails.push(value);
			this.originalTrails.push(value);
		});
	}
	
	openFilters(myEvent) {
		let popover = this.popoverCtrl.create(FilterComponent, {showTrainings: this.showTrainings, showOperations: this.showOperations, showWaterTrails: this.showWaterTrails, showLandTrails: this.showLandTrails});
		popover.present({
			ev: myEvent
		});
		
		
		// TODO: Performanter
		popover.onDidDismiss((data) => {
			if(data){
				this.trails = JSON.parse(JSON.stringify(this.originalTrails));
				this.trails = this.trails.filter((trailSet :Trail[]) => {
					let show = true;
					if(data.showLandTrails == false && trailSet[0].isLandActivity == true){
						show = false;
					}
					if(data.showWaterTrails == false && trailSet[0].isLandActivity == false){
						show = false;
					}
					if(data.showTrainings == false && trailSet[0].isTraining == true){
						show = false;
					}
					if(data.showOperations == false && trailSet[0].isTraining == false){
						show = false;
					}
					return show;
				});
				this.showOperations = data.showOperations;
				this.showTrainings = data.showTrainings;
				this.showLandTrails = data.showLandTrails;
				this.showWaterTrails = data.showWaterTrails;
			}
		});
	}
	
	cardClicked(trail: Trail){
		this.cardSelected.emit({trail});
	}
}
