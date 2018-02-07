import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {Trail} from "../../models/trail";
import {Observable} from "rxjs/Observable";

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
	
	constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient) {
		this.source = this.navParams.get('source');
	}
	
	ionViewDidEnter(){
		this.getFileContents(this.source).subscribe((response) => {
			/*for(let entry of response){
				console.log(JSON.stringify("Entry: "+entry));
				this.validTrail = this.isTrail(entry);
			}*/
		});
		console.log("Is valid trail: "+this.validTrail);
	}
	
	private getFileContents(source: string): Observable<Trail[]>{
		return this.http.get<Trail[]>(source);
	}
	
	/*private isTrail(object: any): object is Trail {
		return (object.trainer !== undefined && object.dog !== undefined && object.path !== undefined && object.markers !== undefined &&
			object.isLandActivity !== undefined && object.isSharedActivity !== undefined && object.isTraining !== undefined);
	}*/
	
	importMerge(){
	
	}
	
	importNew(){
	
	}
}
