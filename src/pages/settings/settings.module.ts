import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {SettingsPage} from './settings';
import {AppPreferences} from "@ionic-native/app-preferences";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
	declarations: [
		SettingsPage,
	],
	imports: [
		IonicPageModule.forChild(SettingsPage),
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient]
			}
		})
	],
	providers: [AppPreferences]
})
export class SettingsPageModule {
}
