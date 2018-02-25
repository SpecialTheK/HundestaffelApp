import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {InitTrailPage} from './init-trail';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
	declarations: [
		InitTrailPage,
	],
	imports: [
		IonicPageModule.forChild(InitTrailPage),
		TranslateModule.forChild()
	],
})
export class InitTrailPageModule {
}
