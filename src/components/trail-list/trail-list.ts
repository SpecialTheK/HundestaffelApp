import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Trail} from "../../models/trail";
import {TranslateService} from "@ngx-translate/core";
import {NavController, PopoverController} from "ionic-angular";
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage";
import {FilterComponent} from "../filter/filter";
import {TrailSet} from "../../models/trailSet";

/**
 * Displays all trailCards in a descending list with the option to filter them.
 */
@Component({
	selector: 'trail-list',
	templateUrl: 'trail-list.html'
})
export class TrailListComponent {
	/**
	 * Defines if the user should be able to filter the cards or not.
	 *
	 * @type {boolean}
	 * @since 1.0.0
	 */
	@Input() showFilters: boolean = false;
	
	/**
	 * Emits the trail object of the clicked card back to the component.
	 *
	 * @type {EventEmitter<any>}
	 * @since 1.0.0
	 */
	@Output() cardSelected = new EventEmitter();
	
	/**
	 * Array containing all currently displayed trailSets.
	 *
	 * @type {Trail[][]}
	 * @since 1.0.0
	 */
	trails: TrailSet[] = [];
	
	/**
	 * Array containing all existing trailSets.
	 *
	 * @type {Trail[][]}
	 * @since 1.0.0
	 */
	originalTrails: TrailSet[] = [];
	
	/**
	 * Filter parameter whether trainings should be displayed.
	 *
	 * @type {boolean}
	 * @since 1.0.0
	 */
	showTrainings: boolean = true;
	
	/**
	 * Filter parameter whether operations should be displayed.
	 *
	 * @type {boolean}
	 * @since 1.0.0
	 */
	showOperations: boolean = true;
	
	/**
	 * Filter parameter whether water trailSets should be displayed.
	 *
	 * @type {boolean}
	 * @since 1.0.0
	 */
	showWaterTrails: boolean = true;
	
	/**
	 * Filter parameter whether land trailSets should be displayed.
	 *
	 * @type {boolean}
	 * @since 1.0.0
	 */
	showLandTrails: boolean = true;
	
	/**
	 * Filter parameter whether shared trailSets should be displayed.
	 *
	 * @type {boolean}
	 * @since 1.0.0
	 */
	showSharedTrails: boolean = true;
	
	constructor(public navCtrl: NavController, public storage: TrailStorageProvider, public translate: TranslateService, public popoverCtrl: PopoverController) {
		this.storage.getLatestTrailSets().subscribe((value:TrailSet) => {
			this.trails.push(value);
			this.originalTrails.push(value);
		});
	}
	
	/**
	 * Fired when the user clicks on the filter fab Button.
	 *
	 * @param myEvent Event context.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	openFilters(myEvent) {
		let popover = this.popoverCtrl.create(FilterComponent, {showTrainings: this.showTrainings, showOperations: this.showOperations, showWaterTrails: this.showWaterTrails, showLandTrails: this.showLandTrails, showSharedTrails: this.showSharedTrails});
		popover.present({
			ev: myEvent
		});
		
		
		// TODO: Performanter
		popover.onDidDismiss((data) => {
			if(data){
				this.trails = JSON.parse(JSON.stringify(this.originalTrails));
				this.trails = this.trails.filter((trailSet :TrailSet) => {
					let show = true;
					if(data.showLandTrails == false && trailSet.isLandTrail == true){
						show = false;
					}
					if(data.showWaterTrails == false && trailSet.isLandTrail == false){
						show = false;
					}
					if(data.showTrainings == false && trailSet.isTraining == true){
						show = false;
					}
					if(data.showOperations == false && trailSet.isTraining == false){
						show = false;
					}
					if(data.showSharedTrails == false && trailSet.isSharedTrail == true){
						show = false;
					}
					return show;
				});
				this.showOperations = data.showOperations;
				this.showTrainings = data.showTrainings;
				this.showLandTrails = data.showLandTrails;
				this.showWaterTrails = data.showWaterTrails;
				this.showSharedTrails = data.showSharedTrails;
			}
		});
	}
	
	/**
	 * Fired when the user clicked on a card.
	 * @param {Trail[]} trail
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	cardClicked(trail: Trail[]){
		this.cardSelected.emit({trailObject: trail});
	}
}
