import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {Trail} from "../../models/trail";
import {Observable} from "rxjs/Observable";
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage";

/**
 * Generated class for the ImportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-import',
	templateUrl: 'import.html',
})
export class ImportPage {
	
	trail: Trail;
	source;

	constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,public http: HttpClient, public storage: TrailStorageProvider) {
		this.source = this.navParams.get('source');
	}

	ionViewDidEnter(){
		this.getFileContents(this.source).subscribe((response) => {
			console.log("Response: "+response);
			if(Trail.isTrailObject(response)){
				this.trail = response;
			} else {
				console.log("No trail object!");
			}
		});
	}

	private getFileContents(source: string): Observable<Trail>{
		console.log("File: "+source);
		return this.http.get<Trail>(source);
	}

	importMerge(){
		let selectModal = this.modalCtrl.create('ListTrailComponent');
		selectModal.present();
	}

	importNew(){
		this.storage.addNewTrailSet(this.trail).then((answer) => {
			this.navCtrl.pop();
		}).catch((error) => {
			console.log("Could not import trail: "+error);
		});
	}
}
