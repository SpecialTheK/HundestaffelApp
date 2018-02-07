import {Component, ViewChild} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {Home} from '../pages/pages';
import {TranslateService} from "@ngx-translate/core";
import {AppPreferences} from "@ionic-native/app-preferences";
import {WebIntent} from "@ionic-native/web-intent";

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild('mainMenu') navCtrl: NavController;
	rootPage: any = Home;
	
	constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, preferences: AppPreferences, translate: TranslateService, public webIntent: WebIntent) {
		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			
			if(platform.is('android')) {
				console.log("Test 1.1");
				this.webIntent.getIntent().then((answer) => {
					if(answer.extras != null && answer.extras["android.intent.extra.STREAM"] != undefined){
						this.navCtrl.push('ImportPage', {source: answer.extras["android.intent.extra.STREAM"]});
					}
				}, (reason) => {
					console.log("File not imported: "+reason);
				});
			}
			translate.setDefaultLang('en');
			preferences.fetch('language').then((answer) => {
				translate.use(answer);
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
}
