import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {SettingsPage} from './settings';
import {AppPreferences} from "@ionic-native/app-preferences";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
	declarations: [
		SettingsPage,
	],
	imports: [
		IonicPageModule.forChild(SettingsPage),
		TranslateModule.forChild()
	],
	providers: [AppPreferences]
})
export class SettingsPageModule {
}
