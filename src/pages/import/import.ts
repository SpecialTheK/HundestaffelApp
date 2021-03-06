import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage";
import {TranslateService} from "@ngx-translate/core";
import {TrailSet} from "../../models/trailSet";

/**
 * Page opened when the user is opening the app with a file.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@IonicPage()
@Component({
	selector: 'page-import',
	templateUrl: 'import.html',
})
export class ImportPage {

	/**
	 * Array containing all trails to import.
	 *
	 * @type {Trail[]}
	 * @since 1.0.0
	 */
	private trailSet: TrailSet;

	/**
	 * URi of the source file.
	 *
	 * @since 1.0.0
	 */
	private source;

	/**
	 * Array containing all translated terms to display in the template.
	 *
	 * @type {string[]}
	 * @since 1.0.0
	 */
	private translatedTerms: Array<string> = [];

	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,public http: HttpClient, public storage: TrailStorageProvider, public translateService: TranslateService) {
		this.source = this.navParams.get('source');
		this.translateVariables();
	}

	/**
	 * Method called to translate all variables needed for this page.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	private translateVariables(){
		let translateTerms = Array("IMPORT_OK", "IMPORT_FAILED", "IMPORT_OK_MESSAGE", "IMPORT_FAILED_MESSAGE", "OK", "IMPORT_NO_TRAIL");
		for(let term of translateTerms){
			this.translateService.get(term).subscribe((answer) => {
				this.translatedTerms[term.toLowerCase()] = answer;
			});
		}
	}

	/**
	 * Ionic lifecycle event called after the page is loaded.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	ionViewDidLoad(){
		this.getFileContents(this.source).then((fileContent) => {
				this.trailSet = fileContent
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

	/**
	 * Private method to get the content of a file.
	 *
	 * @param {string} source The URi of the file to parse.
	 * @returns {Promise<Trail[]>} Promise containing all Trails that were read from the file.
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	private getFileContents(source: string):Promise<TrailSet>{
		console.log("Importing file: "+source);
		return new Promise<TrailSet>((resolve, reject) => {
			this.http.get(source).subscribe((value:TrailSet) => {
				if(TrailSet.isTrailObject(value)){
					resolve(TrailSet.fromData(value));
				} else {
					reject(this.translatedTerms["import_no_trail"]);
				}
			}, (error) => {
				reject(JSON.stringify(error));
			});
		});
	}

	/**
	 * Method called when the user wants to import the file as a new trailSet.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	importNew(){
		this.storage.addNewTrailSet(this.trailSet).then((answer) => {
			let alert = this.alertCtrl.create({
				title: this.translatedTerms["import_ok"],
				subTitle: this.translatedTerms["import_ok_message"],
				buttons: [this.translatedTerms["ok"]]
			});
			alert.present();
			this.navCtrl.pop();
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

	/**
	 * Method called when the user wants to merge the trails into an existing trailSet.
	 *
	 * @param event
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	async mergeWith(event){
		let alreadyShown = false;
		let counter = 0;
		for(let trail of this.trailSet.trails) {
			let result = await this.storage.getTrailSet(event.trailObject.creationID).then(async (_trailSet) => {
				let result = await this.storage.addTrailToSet(_trailSet.creationID, trail, true).then((answer) => {
					++counter;
					if (counter == this.trailSet.trails.length - 1) {
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
						subTitle: this.translatedTerms["import_failed_message"] + '<br>' + error,
						buttons: [this.translatedTerms["ok"]]
					});
					if (!alreadyShown) {
						alreadyShown = true;
						alert.present();
						this.navCtrl.pop();
					}
				});
			});
		}
	}
}
