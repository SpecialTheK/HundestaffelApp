import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HomePage} from './home';
import {TranslateModule} from "@ngx-translate/core";
import {Diagnostic} from "@ionic-native/diagnostic";

@NgModule({
	declarations: [
		HomePage
	],
	imports: [
		IonicPageModule.forChild(HomePage),
		TranslateModule.forChild()
	],
	providers: [Diagnostic]
})
export class HomePageModule {
}
