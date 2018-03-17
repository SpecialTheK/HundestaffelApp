import {Component} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";

/**
 * Component creating a popover to filter a trailList.
 *
 * @since 1.0.0
 * @version 1.0.0
 * @
 */
@Component({
	template: `<ion-list>
		<ion-list-header>{{'FILTER' | translate}}</ion-list-header>
		<ion-item>
			<ion-label>{{'FILTER_SHOW' |translate}} {{'TRAIL_TRAINING' | translate}}</ion-label>
			<ion-checkbox [(ngModel)]="showTrainings"></ion-checkbox>
		</ion-item>
		<ion-item>
			<ion-label>{{'FILTER_SHOW' |translate}} {{'TRAIL_OPERATION' | translate}}</ion-label>
			<ion-checkbox [(ngModel)]="showOperations"></ion-checkbox>
		</ion-item>
		<ion-item>
			<ion-label>{{'FILTER_SHOW' |translate}} {{'TRAIL_LAND' | translate}}</ion-label>
			<ion-checkbox [(ngModel)]="showLandTrails"></ion-checkbox>
		</ion-item>
		<ion-item>
			<ion-label>{{'FILTER_SHOW' |translate}} {{'TRAIL_WATER' | translate}}</ion-label>
			<ion-checkbox [(ngModel)]="showWaterTrails"></ion-checkbox>
		</ion-item>
		<ion-item>
			<ion-label>{{'FILTER_SHOW' |translate}} {{'TRAIL_SHARED' | translate}}</ion-label>
			<ion-checkbox [(ngModel)]="showSharedTrails"></ion-checkbox>
		</ion-item>
		<ion-item>
			<button ion-button (click)="close()">{{'FILTER_APPLY' | translate}}</button>
		</ion-item>
</ion-list>`
})
export class FilterComponent {
	
	/**
	 * Filter parameter whether trainings should be displayed.
	 *
	 * @type {boolean}
	 * @since 1.0.0
	 */
	showTrainings:boolean;
	
	/**
	 * Filter parameter whether operations should be displayed.
	 *
	 * @type {boolean}
	 * @since 1.0.0
	 */
	showOperations:boolean;
	
	/**
	 * Filter parameter whether water trailSets should be displayed.
	 *
	 * @type {boolean}
	 * @since 1.0.0
	 */
	showWaterTrails:boolean;
	
	/**
	 * Filter parameter whether land trailSets should be displayed.
	 *
	 * @type {boolean}
	 * @since 1.0.0
	 */
	showLandTrails:boolean;
	
	/**
	 * Filter parameter whether shared trailSets should be displayed.
	 *
	 * @type {boolean}
	 * @since 1.0.0
	 */
	showSharedTrails: boolean;
	
	constructor(public viewCtrl: ViewController, public navParams: NavParams) {
		this.showTrainings = this.navParams.get('showTrainings');
		this.showOperations = this.navParams.get('showOperations');
		this.showWaterTrails = this.navParams.get('showWaterTrails');
		this.showLandTrails = this.navParams.get('showLandTrails');
		this.showSharedTrails = this.navParams.get('showSharedTrails');
	}
	
	/**
	 * Fired when the apply changes button is clicked. Passes the selected options to the parent.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	close() {
		this.viewCtrl.dismiss({showTrainings: this.showTrainings, showOperations: this.showOperations, showWaterTrails: this.showWaterTrails, showLandTrails: this.showLandTrails, showSharedTrails: this.showSharedTrails});
	}
}
