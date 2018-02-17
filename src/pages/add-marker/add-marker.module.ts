import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AddMarkerPage} from './add-marker';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
	declarations: [
		AddMarkerPage,
	],
	imports: [
		IonicPageModule.forChild(AddMarkerPage),
		TranslateModule.forChild()
	],
})
export class AddMarkerPageModule {
}
