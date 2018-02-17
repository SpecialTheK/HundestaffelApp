import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {Trail} from "../../models/trail";
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
	selector: 'page-import',
	templateUrl: 'import.html',
})
export class ImportPage {
	
	private trailSet: Trail[] = [];
	private source;
	private translatedTerms: Array<string> = [];

	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,public http: HttpClient, public storage: TrailStorageProvider, public translateService: TranslateService) {
		this.source = this.navParams.get('source');
		this.translateVariables();
	}
	
	private translateVariables(){
		let translateTerms = Array("IMPORT_OK", "IMPORT_FAILED", "IMPORT_OK_MESSAGE", "IMPORT_FAILED_MESSAGE", "OK", "IMPORT_NO_TRAIL");
		for(let term of translateTerms){
			this.translateService.get(term).subscribe((answer) => {
				this.translatedTerms[term.toLowerCase()] = answer;
			});
		}
	}

	ionViewDidLoad(){
		this.getFileContents(this.source).then((fileContent) => {
			fileContent.forEach((value:Trail) => {
				let dummyTrail = new Trail(value.id, value.trainer, value.dog, value.isLandActivity, value.isSharedActivity, value.isTraining);
				dummyTrail.importTrail(value);
				this.trailSet.push(dummyTrail);
			});
		}).catch((error) => {
			let alert = this.alertCtrl.create({
				title: this.translatedTerms["import_failed"],
				subTitle: this.translatedTerms["import_failed_message"]+'<br>'+error,
				buttons: [this.translatedTerms["ok"]]
			});
			alert.present();
			this.navCtrl.pop();
		});
	}

	private getFileContents(source: string):Promise<Trail[]>{
		console.log("Importing file: "+source);
		return new Promise<Trail[]>((resolve, reject) => {
			this.http.get(source).subscribe((value:Array<any>) => {
				if(Trail.isTrailObject(value)){
					resolve(value);
				} else {
					reject(this.translatedTerms["import_no_trail"]);
				}
			}, (error) => {
				reject(JSON.stringify(error));
			});
		});
	}

	importNew(){
		let key: string = "";
		let counter = 0;
		this.trailSet.forEach((value, index) => {
			if(index == 0){
				console.log(value);
				key = value.startTime.toString();
				this.storage.addNewTrailSet(value).then((answer) => {
					++counter;
					if(counter == this.trailSet.length){
						let alert = this.alertCtrl.create({
							title: this.translatedTerms["import_ok"],
							subTitle: this.translatedTerms["import_ok_message"],
							buttons: [this.translatedTerms["ok"]]
						});
						alert.present();
						this.navCtrl.pop();
					}
				}).catch((error) => {
					let alert = this.alertCtrl.create({
						title: this.translatedTerms["import_failed"],
						subTitle: this.translatedTerms["import_failed_message"]+'<br>'+error,
						buttons: [this.translatedTerms["ok"]]
					});
					alert.present();
					this.navCtrl.pop();
				});
			} else {
				this.storage.addTrailToSet(key, value).then((answer) => {
					++counter;
					if(counter == this.trailSet.length){
						let alert = this.alertCtrl.create({
							title: this.translatedTerms["import_ok"],
							subTitle: this.translatedTerms["import_ok_message"],
							buttons: [this.translatedTerms["ok"]]
						});
						alert.present();
						this.navCtrl.pop();
					}
				}).catch((error) => {
					let alert = this.alertCtrl.create({
						title: this.translatedTerms["import_failed"],
						subTitle: this.translatedTerms["import_failed_message"]+'<br>'+error,
						buttons: [this.translatedTerms["ok"]]
					});
					alert.present();
					this.navCtrl.pop();
				});
			}
		});
	}
	
	mergeWith(event){
		let counter = 0;
		this.trailSet.forEach((value) => {
			this.storage.addTrailToSet(event.trail[0].startTime, value).then((answer) => {
				++counter;
				if(counter == this.trailSet.length){
					let alert = this.alertCtrl.create({
						title: this.translatedTerms["import_ok"],
						subTitle: this.translatedTerms["import_ok_message"],
						buttons: [this.translatedTerms["ok"]]
					});
					alert.present();
					this.navCtrl.pop();
				}
			}).catch((error) => {
				let alert = this.alertCtrl.create({
					title: this.translatedTerms["import_failed"],
					subTitle: this.translatedTerms["import_failed_message"]+'<br>'+error,
					buttons: [this.translatedTerms["ok"]]
				});
				alert.present();
				this.navCtrl.pop();
			});
		});
	}
}
