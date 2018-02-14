import {Component, ViewChild} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {Home} from '../pages/pages';
import {TranslateService} from "@ngx-translate/core";
import {AppPreferences} from "@ionic-native/app-preferences";
import {WebIntent} from "@ionic-native/web-intent";
import {TrailStorageProvider} from "../providers/trail-storage/trail-storage";
import {Trail} from "../models/trail";

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild('mainMenu') navCtrl: NavController;
	rootPage: any = Home;
	trails: Trail[][] = [];
	
	constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, preferences: AppPreferences, translate: TranslateService, public webIntent: WebIntent, public storage: TrailStorageProvider) {
		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			if(platform.is('android')) {
				this.webIntent.getIntent().then((answer) => {
					if(answer.extras != null && answer.extras["android.intent.extra.STREAM"] != undefined){
						this.navCtrl.push('ImportPage', {source: answer.extras["android.intent.extra.STREAM"]});
					}
				}, (reason) => {
					console.log("File not imported: "+reason);
				});
			}
			this.navCtrl.push('ImportPage', {source: "none"});
			translate.setDefaultLang('en');
			preferences.fetch('language').then((answer) => {
				translate.use(answer);
			});
			this.storage.getLatestTrailSets(5).subscribe((value:Trail[]) => {
				this.trails.push(value);
			});
			statusBar.styleDefault();
			splashScreen.hide();
		});
	}
	
	openPage(name){
		if(name == 'HomePage'){
			this.navCtrl.popToRoot();
		} else {
			this.navCtrl.push(name);
		}
	}
	
	openEntry(trail: Trail){
		this.navCtrl.push('HistoryEntryPage', {trailObject: trail});
	}
}
