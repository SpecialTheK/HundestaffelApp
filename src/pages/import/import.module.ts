import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ImportPage} from './import';
import {HttpClientModule} from "@angular/common/http";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
	declarations: [
		ImportPage,
	],
	imports: [
		IonicPageModule.forChild(ImportPage),
		HttpClientModule,
		IonicPageModule.forChild(ImportPage),
		TranslateModule.forChild()
	],
})
export class ImportPageModule {
}
