import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ImportPage} from './import';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
	declarations: [
		ImportPage,
	],
	imports: [
		IonicPageModule.forChild(ImportPage),
		HttpClientModule
	],
})
export class ImportPageModule {
}
