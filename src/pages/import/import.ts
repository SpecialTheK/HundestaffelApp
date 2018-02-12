import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {Trail} from "../../models/trail";
import {Observable} from "rxjs/Observable";
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage"

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

	content: Trail[];
	validTrail: boolean = false;
	source;

	constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public storage: TrailStorageProvider) {
		this.source = this.navParams.get('source');
	}

	ionViewDidEnter(){
		this.getFileContents(this.source).subscribe((response) => {
			console.log("Response: "+response);
			if(this.isTrail(response)){
				//this.storage.saveTrail(response, response.startTime);
			}
		});
		console.log("Is valid trail: "+this.validTrail);
	}

	private getFileContents(source: string): Observable<Trail>{
		console.log("File: "+source);
		return this.http.get<Trail>(source);
	}

	private isTrail(trail:any):boolean{
		return true;
	}

	importMerge(){

	}

	importNew(){

	}
}
