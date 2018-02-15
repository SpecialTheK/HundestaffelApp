import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

@IonicPage()
@Component({
	selector: 'page-history',
	templateUrl: 'history.html',
})
export class HistoryPage {
	constructor(public navCtrl: NavController) {
	}
	
	cardClicked(trail){
		this.navCtrl.push('HistoryEntryPage', trail);
	}
}
