import {Component, ViewChild, ElementRef} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Trail} from "../../models/trail";
import {TranslateService} from "@ngx-translate/core";
import {SocialSharing} from "@ionic-native/social-sharing";
import {MapProvider} from "../../providers/map/map";
import {ShareTrailProvider} from "../../providers/share-trail/share-trail";
import {PdfUtilProvider} from "../../providers/pdf-util/pdf-util";
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage";

/**
 * Page to display a single entry from the history.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@IonicPage()
@Component({
	selector: 'page-history-entry',
	providers: [MapProvider],
	templateUrl: 'history-entry.html',
})
export class HistoryEntryPage {

	/**
	 * Direct ref to the map element in order to insert the map.
	 *
	 * @since 1.0.0
	 */
	@ViewChild('map') mapElement: ElementRef;

	/**
	 * Array containing all trails of this trailSet.
	 *
	 * @since 1.0.0
	 */
	trailSet: Trail[];

	/**
	 * String containing the localized name of the map type.
	 *
	 * @type {string} Land or water (localized)
	 * @since 1.0.0
	 */
	mapType = "";

	/**
	 * String containing the localized name of the operation type.
	 *
	 * @type {string} Operation or training (localized)
	 * @since 1.0.0
	 */
	operationType = "";

	/**
	 * Number of total trails in this trailSet.
	 *
	 * @since 1.0.0
	 */
	trails: number;

	/**
	 * Array containing all dogs and their duration that were part of this trailSet.
	 *
	 * @type {any[]}
	 * @since 1.0.0
	 */
	dogs: Array<Object> = [];

	/**
	 * Array containing all terms to insert into the template after translating them.
	 *
	 * @type {string[]}
	 * @since 1.0.0
	 */
	translatedTerms: Array<string> = [];

	constructor(public navCtrl: NavController, navParams: NavParams, public alertCtrl: AlertController, public trailStorage: TrailStorageProvider, public translateService: TranslateService, public map: MapProvider, public social: SocialSharing, public share: ShareTrailProvider, public pdf: PdfUtilProvider) {
		this.trailSet = navParams.get('trailObject');
		this.translateVariables();
	}

	/**
	 * Method called to translate all terms used in this template.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	private translateVariables(){
		let translateTerms = Array("TRAIL_DELETE", "DELETE", "TRAIL_DELETE_MESSAGE", "ABORT", "TRAIL_TRAINING", "TRAIL_OPERATION", "TRAIL_LAND", "TRAIL_WATER");
		for(let term of translateTerms){
			this.translateService.get(term).subscribe((answer) => {
				this.translatedTerms[term.toLowerCase()] = answer;
			});
		}
	}

	/**
	 * Ionic lifecycle event fired when the page is getting loaded.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	ionViewWillLoad(){
		if(this.trailSet[0].isTraining){
			this.operationType = this.translatedTerms["trail_training"];
		} else {
			this.operationType = this.translatedTerms["trail_operation"];
		}
		if(this.trailSet[0].isLandActivity){
			this.mapType = this.translatedTerms["trail_land"];
		} else {
			this.mapType = this.translatedTerms["trail_water"];
		}
		this.trails = this.trailSet.length;
		this.trailSet.forEach((value: Trail) => {
			this.dogs.push({name: value.dog, duration: (value.endTime-value.startTime)});
		});

		this.map.initMapObject(this.mapElement);
		//TODO (christian): laden von trails wieder möglich machen!
		//this.map.viewExistingSession(this.trailSet);
	}

	/**
	 * Method called to share the trailSet in the app's file format.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	shareAsJSON(){
		this.share.shareTrail(this.trailSet);
	}

	/**
	 * Method called to share a pdf of the trailSet.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	shareAsPdf(){
		this.pdf.sharePdf(this.trailSet, this.mapElement).catch((error) => {
			console.log(JSON.stringify(error, Object.getOwnPropertyNames(error)));
		});
	}

	/**
	 * Method called to delete a trailSet from the storage. Cannot be reverted.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	deleteTrailSet(){
		let alert = this.alertCtrl.create({
			title: this.translatedTerms["trail_delete"],
			subTitle: this.translatedTerms["trail_delete_message"],
			buttons: [
				{
					text: this.translatedTerms["abort"],
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				},
				{
					text: this.translatedTerms["delete"],
					handler: () => {
						this.trailStorage.removeTrailSet(this.trailSet[0].startTime.toString()).then((answer) => {
							this.navCtrl.pop();
						})
					}
				}
			]
		});
		alert.present();
	}
}
