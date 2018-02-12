import {Component} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";

/**
 * Generated class for the FilterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
	template: `<ion-list>
		<ion-list-header>{{'FILTER' | translate}}</ion-list-header>
		<ion-item>
			<ion-label>{{'SHOW' |translate}} {{'HISTORY_TRAINING' | translate}}</ion-label>
			<ion-checkbox [(ngModel)]="showTrainings"></ion-checkbox>
		</ion-item>
		<ion-item>
			<ion-label>{{'SHOW' |translate}} {{'HISTORY_OPERATION' | translate}}</ion-label>
			<ion-checkbox [(ngModel)]="showOperations"></ion-checkbox>
		</ion-item>
		<ion-item>
			<ion-label>{{'SHOW' |translate}} {{'TRAIL_LAND' | translate}}</ion-label>
			<ion-checkbox [(ngModel)]="showLandTrails"></ion-checkbox>
		</ion-item>
		<ion-item>
			<ion-label>{{'SHOW' |translate}} {{'TRAIL_WATER' | translate}}</ion-label>
			<ion-checkbox [(ngModel)]="showWaterTrails"></ion-checkbox>
		</ion-item>
		<ion-item>
			<button ion-button (click)="close()">{{'APPLY_FILTERS' | translate}}</button>
		</ion-item>
</ion-list>`
})
export class FilterComponent {
	
	showTrainings:boolean;
	showOperations:boolean;
	showWaterTrails:boolean;
	showLandTrails:boolean;
	
	constructor(public viewCtrl: ViewController, public navParams: NavParams) {
		this.showTrainings = this.navParams.get('showTrainings');
		this.showOperations = this.navParams.get('showOperations');
		this.showWaterTrails = this.navParams.get('showWaterTrails');
		this.showLandTrails = this.navParams.get('showLandTrails');
	}
	
	close() {
		this.viewCtrl.dismiss({showTrainings: this.showTrainings, showOperations: this.showOperations, showWaterTrails: this.showWaterTrails, showLandTrails: this.showLandTrails});
	}
}
