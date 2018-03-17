import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {InitTrailPage} from './init-trail';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from "../../components/components.module";
import {DetailsFormComponent} from "../../components/details-form/details-form";
import {Diagnostic} from "@ionic-native/diagnostic";
import {LocationAccuracy} from "@ionic-native/location-accuracy";

@NgModule({
	declarations: [
		InitTrailPage,
	],
	imports: [
		IonicPageModule.forChild(InitTrailPage),
		TranslateModule.forChild(),
		ComponentsModule
	],
	entryComponents: [DetailsFormComponent],
	providers: [Diagnostic, LocationAccuracy]
})
export class InitTrailPageModule {
}
