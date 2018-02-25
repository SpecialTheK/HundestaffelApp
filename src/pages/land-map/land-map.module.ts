import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LandMapPage} from './land-map';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
	declarations: [
		LandMapPage,
	],
	imports: [
		IonicPageModule.forChild(LandMapPage),
		TranslateModule.forChild()
	],
})
export class LandMapPageModule {
}
