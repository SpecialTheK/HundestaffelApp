import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import { Trail } from '../../models/trail';
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage";
import {TranslateService} from "@ngx-translate/core";
import {FilterComponent} from "../../components/filter/filter";

@IonicPage()
@Component({
	selector: 'page-history',
	templateUrl: 'history.html',
})
export class HistoryPage {

	trails: Trail[][] = [];
	originalTrails: Trail[][] = [];
	showTrainings:boolean = true;
	showOperations:boolean = true;
	showWaterTrails:boolean = true;
	showLandTrails:boolean = true;

	constructor(public navCtrl: NavController, public navParams: NavParams, public storage: TrailStorageProvider, public translate: TranslateService, public popoverCtrl: PopoverController) {
		this.storage.getTrailSets().subscribe((value:Trail[]) => {
			this.trails.push(value);
			this.originalTrails.push(value);
		});
	}
  
	test(trail){

		console.log(trail);

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
	
	openEntry(trail: Trail){
		this.navCtrl.push('HistoryEntryPage', {trailObject: trail});
	}
}
