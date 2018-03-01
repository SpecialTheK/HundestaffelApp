import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {TrailSet} from '../../models/trailSet';
import {Diagnostic} from "@ionic-native/diagnostic";
import {LocationAccuracy} from "@ionic-native/location-accuracy";

/**
 * Page called before starting the recording of a new trail to set a few variables.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@IonicPage()
@Component({
	selector: 'page-init-trail',
	templateUrl: 'init-trail.html',
})
export class InitTrailPage {
	isLandTrail: boolean;
	
	constructor(public navCtrl: NavController, public navParams: NavParams, diagnostic: Diagnostic, platform: Platform, alertCtrl: AlertController, locationAccuracy: LocationAccuracy) {
		this.isLandTrail = this.navParams.get('isLandTrail');
		
		if(platform.is('cordova')){
			diagnostic.isLocationEnabled().then((status) => {
				if (!status) {
					locationAccuracy.canRequest().then((request) => {
						if(request) {
							locationAccuracy.request(locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).catch((error) => {
								console.log('Error requesting location permissions', error)
							});
						} else {
							let alert = alertCtrl.create({
								title: 'Low battery',
								subTitle: '10% of battery remaining',
								buttons: ['Dismiss']
							});
							alert.present();
						}
					});
				}
			});
			diagnostic.isCameraAuthorized().then((request) => {
				if(!request){
					diagnostic.requestCameraAuthorization(true).catch((error) => {
						console.log("Camera authorization status not granted: "+error);
					})
				} else {
					console.log("Camera authorization granted");
				}
			}).catch((error) => {
				console.log("Camera authorization status not granted: "+error);
			});
		}
	}
	
	gotoMap(data) {
		let trailSet: TrailSet = new TrailSet(this.isLandTrail, false, true, data.preSituation, data.situation, data.temperature, data.precipitation, data.risks, data.person);
		if (this.isLandTrail) {
			console.log("LAND");
			this.navCtrl.push('LandMapPage', {trailSet: trailSet, dog: data.dogs[0]});
		} else {
			console.log("WASSER");
			this.navCtrl.push('WaterMapPage', {trailSet: trailSet, dogs: data.dogs});
		}
	}
}
