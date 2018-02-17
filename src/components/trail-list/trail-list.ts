import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Trail} from "../../models/trail";
import {TranslateService} from "@ngx-translate/core";
import {NavController, PopoverController} from "ionic-angular";
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage";
import {FilterComponent} from "../filter/filter";

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
	 * @type {boolean}
	 * @since 1.0.0
	 */
	@Input() showFilters: boolean = false;
	
	/**
	 * Emits the trail object of the clicked card back to the component.
	 * @type {EventEmitter<any>}
	 * @since 1.0.0
	 */
	@Output() cardSelected = new EventEmitter();
	
	/**
	 * Array containing all currently displayed trailSets.
	 * @type {Trail[][]}
	 * @since 1.0.0
	 */
	trails: Trail[][] = [];
	
	/**
	 * Array containing all existing trailSets.
	 * @type {Trail[][]}
	 * @since 1.0.0
	 */
	originalTrails: Trail[][] = [];
	
	/**
	 * Filter parameter whether trainings should be displayed.
	 * @type {boolean}
	 * @since 1.0.0
	 */
	showTrainings: boolean = true;
	
	/**
	 * Filter parameter whether operations should be displayed.
	 * @type {boolean}
	 * @since 1.0.0
	 */
	showOperations: boolean = true;
	
	/**
	 * Filter parameter whether water trailSets should be displayed.
	 * @type {boolean}
	 * @since 1.0.0
	 */
	showWaterTrails: boolean = true;
	
	/**
	 * Filter whether whether land trailSets should be displayed.
	 * @type {boolean}
	 * @since 1.0.0
	 */
	showLandTrails: boolean = true;
	
	constructor(public navCtrl: NavController, public storage: TrailStorageProvider, public translate: TranslateService, public popoverCtrl: PopoverController) {
		this.storage.getLatestTrailSets().subscribe((value:Trail[]) => {
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
