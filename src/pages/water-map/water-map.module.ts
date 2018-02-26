import { NgModule } from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import { WaterMapPage } from './water-map';
import {TranslateModule} from "@ngx-translate/core";
import {Flashlight} from "@ionic-native/flashlight";
import {AppPreferences} from "@ionic-native/app-preferences";
import {BackgroundMode} from "@ionic-native/background-mode";
import {ComponentsModule} from "../../components/components.module";
import {DetailsFormComponent} from "../../components/details-form/details-form";

@NgModule({
    declarations: [
        WaterMapPage,
    ],
    imports: [
        IonicPageModule.forChild(WaterMapPage),
        TranslateModule.forChild(),
	    ComponentsModule
    ],
	providers: [
		Flashlight,
		AppPreferences,
		BackgroundMode
	],
	entryComponents: [DetailsFormComponent]
})
export class WaterMapPageModule {}
