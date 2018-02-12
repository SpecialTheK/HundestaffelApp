import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ShareTrailProvider} from "../../providers/share-trail/share-trail";

import { Storage } from '@ionic/storage';

import { Trail } from '../../models/trail';

@IonicPage()
@Component({
	selector: 'page-history',
	templateUrl: 'history.html',
})
export class HistoryPage {

	trails: any = [];

	constructor(public navCtrl: NavController, public navParams: NavParams, public sharing: ShareTrailProvider, public storage: Storage) {
		this.storage.forEach(i => {
			let t = JSON.parse(i);
			this.trails.push(t);
		});
	}

	test(trail){

		console.log(trail);

	}

	/*
	share(id: number){
		// TODO: remove
		let data = [
				{
					trainer:    "Jonas",
					dog:        "Hund 1",
					path:       [{lat: 100, lng: 200}],
					markers:     [],
          isLandActivity: false,
          isSharedActivity: false,
          isTraining: false,
				},
			];

		this.sharing.share(data).catch((reason) => {
			console.log("Could not share: "+ reason);
		})
	}
	*/
}
