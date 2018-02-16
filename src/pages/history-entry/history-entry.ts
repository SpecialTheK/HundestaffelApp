import {Component, ViewChild, ElementRef} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Trail} from "../../models/trail";
import {TranslateService} from "@ngx-translate/core";
import {SocialSharing} from "@ionic-native/social-sharing";
import {MapProvider} from "../../providers/map/map";
import {ShareTrailProvider} from "../../providers/share-trail/share-trail";
import {PdfUtilProvider} from "../../providers/pdf-util/pdf-util";
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage";


import html2canvas from "html2canvas/dist/html2canvas"
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
	
	translate_delete = "";
	translate_delete_short = "";
	translate_delete_message = "";
	translate_abort = "";

	constructor(public navCtrl: NavController, navParams: NavParams, public alertCtrl: AlertController, public trailStorage: TrailStorageProvider, public translate: TranslateService, public map: MapProvider, public social: SocialSharing, public share: ShareTrailProvider, public pdf: PdfUtilProvider) {
		this.trailSet = navParams.get('trailObject');
		this.translate.get('DELETE_TRAILSET').subscribe((answer) => {
			this.translate_delete = answer;
		});
		this.translate.get('DELETE').subscribe((answer) => {
			this.translate_delete_short = answer;
		});
		this.translate.get('DELETE_MESSAGE').subscribe((answer) => {
			this.translate_delete_message = answer;
		});
		this.translate.get('ABORT').subscribe((answer) => {
			this.translate_abort = answer;
		});
	}

	ionViewWillLoad(){
		if(this.trailSet[0].isTraining){
			this.translate.get('HISTORY_TRAINING').subscribe(value => {
				this.operationType = value;
			});
		} else {
			this.translate.get('HISTORY_OPERATION').subscribe(value => {
				this.operationType = value;
			});
		}
		if(this.trailSet[0].isLandActivity){
			this.translate.get('TRAIL_LAND').subscribe(value => {
				this.mapType = value;
			});
		} else {
			this.translate.get('TRAIL_WATER').subscribe(value => {
				this.mapType = value;
			});
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
		/*this.pdf.sharePdf(this.trailSet).catch((error) => {
			console.log(JSON.stringify(error));
		});*/
		html2canvas(this.mapElement.nativeElement).then((canvas) => {
			let map = canvas.toDataURL("img/png");
			console.log("ä"+map+"ä");
		});
	}
	
	deleteTrailSet(){
		let alert = this.alertCtrl.create({
			title: this.translate_delete,
			subTitle: this.translate_delete_message,
			buttons: [
				{
					text: this.translate_abort,
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				},
				{
					text: this.translate_delete_short,
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
