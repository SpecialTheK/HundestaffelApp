import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

/**
 * Page displaying all trails via the trailList provider.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@IonicPage()
@Component({
	selector: 'page-history',
	templateUrl: 'history.html',
})
export class HistoryPage {
	constructor(public navCtrl: NavController) {
	}
	
	/**
	 * Method fired when the user has clicked on a card.
	 *
	 * @param trail The Trail object to open on the historyEntryPage.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	cardClicked(trail){
		this.navCtrl.push('HistoryEntryPage', trail);
	}
}
