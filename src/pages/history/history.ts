import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ShareTrailProvider} from "../../providers/share-trail/share-trail";

/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-history',
	templateUrl: 'history.html',
})
export class HistoryPage {
	constructor(public navCtrl: NavController, public navParams: NavParams, public sharing: ShareTrailProvider) {
	}
	
	share(id: number){
		// TODO: remove
		let data = [
				{
					trainer:    "Jonas",
					dog:        "Hund 1",
					path:       [{lat: 100, lng: 200}],
					markers:     []
				},
			];
		
		this.sharing.share(data).catch((reason) => {
			console.log("Could not share: "+ reason);
		})
	}
}
