import { NgModule } from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import { WaterMapPage } from './water-map';
import {TranslateModule} from "@ngx-translate/core";
import {Flashlight} from "@ionic-native/flashlight";
import {AppPreferences} from "@ionic-native/app-preferences";
import {BackgroundMode} from "@ionic-native/background-mode";

@NgModule({
    declarations: [
        WaterMapPage,
    ],
    imports: [
        IonicPageModule.forChild(WaterMapPage),
        TranslateModule.forChild()
    ],
	providers: [
		Flashlight,
		AppPreferences,
		BackgroundMode
	]
})
export class WaterMapPageModule {}
