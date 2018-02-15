import {Component, ViewChild, ElementRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Trail} from "../../models/trail";
import {TranslateService} from "@ngx-translate/core";
import {SocialSharing} from "@ionic-native/social-sharing";
import {MapProvider} from "../../providers/map/map";
import {ShareTrailProvider} from "../../providers/share-trail/share-trail";
import {PdfUtilProvider} from "../../providers/pdf-util/pdf-util";

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

	constructor(public navCtrl: NavController, navParams: NavParams, public translate: TranslateService, public map: MapProvider, public social: SocialSharing, public share: ShareTrailProvider, public pdf: PdfUtilProvider) {
		this.trailSet = navParams.get('trailObject');
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
		this.trailSet.forEach((value: Trail, index:number) => {
			this.dogs.push({name: value.dog, duration: (value.endTime-value.startTime)});
		});

		this.map.initMap(this.mapElement);
		this.map.viewExistingSession(this.trailSet);
	}

	exportAsJSON(){
		this.share.shareTrail(this.trailSet).catch((error) => {
			console.log(JSON.stringify(error));
		});
	}

	exportAsPdf(){
		this.pdf.sharePdf(this.trailSet).catch((error) => {
			console.log(JSON.stringify(error));
		});
	}
}
