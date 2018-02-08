import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ShareTrailProvider} from "../../providers/share-trail/share-trail";
import { Trail } from '../../models/trail';
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage";
import {Observable} from "rxjs/Observable";

@IonicPage()
@Component({
	selector: 'page-history',
	templateUrl: 'history.html',
})
export class HistoryPage {

	trails: Observable<Trail[]>;

	constructor(public navCtrl: NavController, public navParams: NavParams, public sharing: ShareTrailProvider, public storage: TrailStorageProvider) {
		this.trails = this.storage.getTrailSets();
	}

	test(trail: Trail[]){
		/*this.storage.getTrailSet(trail).then((answer) => {
			console.log(answer);
		});*/
		console.log(JSON.stringify(trail));
	}
	
	test2(key: any){
		console.log(this.storage.getTrailSet(key).then((response) => {
			console.log(JSON.stringify(response));
		}))
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
