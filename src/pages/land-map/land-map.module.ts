import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LandMapPage} from './land-map';
import {TranslateModule} from "@ngx-translate/core";
import {AppPreferences} from "@ionic-native/app-preferences";
import {Flashlight} from "@ionic-native/flashlight";
import {BackgroundMode} from "@ionic-native/background-mode";
import {ComponentsModule} from "../../components/components.module";
import {DetailsFormComponent} from "../../components/details-form/details-form";
import {ImagePopupComponent} from "../../components/image-popup/image-popup";

@NgModule({
	declarations: [
		LandMapPage,
	],
	imports: [
		IonicPageModule.forChild(LandMapPage),
		TranslateModule.forChild(),
		ComponentsModule
	],
	providers: [
		Flashlight,
		AppPreferences,
		BackgroundMode
	],
	entryComponents: [DetailsFormComponent, ImagePopupComponent]
})
export class LandMapPageModule {
}
