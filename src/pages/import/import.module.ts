import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ImportPage} from './import';
import {HttpClientModule} from "@angular/common/http";
import {TranslateModule} from "@ngx-translate/core";
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage";
import {ComponentsModule} from "../../components/components.module";
import {Globalization} from "@ionic-native/globalization";

@NgModule({
	declarations: [
		ImportPage,
	],
	imports: [
		IonicPageModule.forChild(ImportPage),
		HttpClientModule,
		IonicPageModule.forChild(ImportPage),
		TranslateModule.forChild(),
		ComponentsModule
	],
	providers: [TrailStorageProvider, Globalization]
})
export class ImportPageModule {
}
