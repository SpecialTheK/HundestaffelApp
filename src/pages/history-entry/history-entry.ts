import {Component, ViewChild, ElementRef} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Trail} from "../../models/trail";
import {TranslateService} from "@ngx-translate/core";
import {SocialSharing} from "@ionic-native/social-sharing";
import {MapProvider} from "../../providers/map/map";
import {ShareTrailProvider} from "../../providers/share-trail/share-trail";
import {PdfUtilProvider} from "../../providers/pdf-util/pdf-util";
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage";

@IonicPage()
@Component({
	selector: 'page-history-entry',
	providers: [MapProvider],
	templateUrl: 'history-entry.html',
})
export class HistoryEntryPage {

	@ViewChild('map') mapElement: ElementRef;

	trailSet: Trail[];
	mapType = "";
	operationType = "";
	trails: number;
	dogs: Array<Object> = [];
	translatedTerms: Array<string> = [];

	constructor(public navCtrl: NavController, navParams: NavParams, public alertCtrl: AlertController, public trailStorage: TrailStorageProvider, public translateService: TranslateService, public map: MapProvider, public social: SocialSharing, public share: ShareTrailProvider, public pdf: PdfUtilProvider) {
		this.trailSet = navParams.get('trailObject');
		this.translateVariables();
	}
	
	private translateVariables(){
		let translateTerms = Array("TRAIL_DELETE", "DELETE", "TRAIL_DELETE_MESSAGE", "ABORT", "TRAIL_TRAINING", "TRAIL_OPERATION", "TRAIL_LAND", "TRAIL_WATER");
		for(let term of translateTerms){
			this.translateService.get(term).subscribe((answer) => {
				this.translatedTerms[term.toLowerCase()] = answer;
			});
		}
	}

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

		this.map.initMap(this.mapElement);
		this.map.viewExistingSession(this.trailSet);
	}

	shareAsJSON(){
		this.share.shareTrail(this.trailSet);
	}

	shareAsPdf(){
		this.pdf.sharePdf(this.trailSet, this.mapElement).catch((error) => {
			console.log(JSON.stringify(error, Object.getOwnPropertyNames(error)));
		});
	}
	
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
