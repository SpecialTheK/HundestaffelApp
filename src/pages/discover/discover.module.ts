import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {DiscoverPage} from './discover';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
	declarations: [
		DiscoverPage,
	],
	imports: [
		IonicPageModule.forChild(DiscoverPage),
		TranslateModule.forChild()
	],
})
export class DiscoverPageModule {
}
