import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LandMapPage} from './land-map';
import {TranslateModule} from "@ngx-translate/core";
import {AppPreferences} from "@ionic-native/app-preferences";
import {Flashlight} from "@ionic-native/flashlight";
import {BackgroundMode} from "@ionic-native/background-mode";

@NgModule({
	declarations: [
		LandMapPage,
	],
	imports: [
		IonicPageModule.forChild(LandMapPage),
		TranslateModule.forChild()
	],
	providers: [
		Flashlight,
		AppPreferences,
		BackgroundMode
	]
})
export class LandMapPageModule {
}
