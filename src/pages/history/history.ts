import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {Trail} from "../../models/trail";

@IonicPage()
@Component({
	selector: 'page-history',
	templateUrl: 'history.html',
})
export class HistoryPage {
	constructor(public navCtrl: NavController) {
	}
	
	cardClicked(trail: Trail){
		this.navCtrl.push('HistoryEntryPage', {trailObject: trail});
	}
}
