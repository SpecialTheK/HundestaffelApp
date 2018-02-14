import {Component, ViewChild, ElementRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Trail} from "../../models/trail";
import {TranslateService} from "@ngx-translate/core";
import {SocialSharing} from "@ionic-native/social-sharing";
import {MapProvider} from "../../providers/map/map";
import {ShareTrailProvider} from "../../providers/share-trail/share-trail";
import {PdfUtilProvider} from "../../providers/pdf-util/pdf-util";

/**
 * Generated class for the HistoryEntryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-history-entry',
	templateUrl: 'history-entry.html',
})
export class HistoryEntryPage {

	@ViewChild('map') mapElement: ElementRef;

	trailSet: Trail[];
	mapType = "";
	operationType = "";
	trails: number;
	dogs: [{}];

	constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService, public map: MapProvider, public social: SocialSharing, public share: ShareTrailProvider, public pdf: PdfUtilProvider) {
		this.trailSet = this.navParams.get('trail');
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
		//TODO: hier sollte die viewExistingSession-Methode genutzt werden. Muss allerdings noch implementiert werden!
		for(let t of this.trailSet){
			this.map.loadTrail(t);
		}

	}

	exportAsJSON(){
		this.share.share(this.trailSet);
	}

	exportAsPdf(){
		this.pdf.createPdf(this.trailSet);
	}
}
