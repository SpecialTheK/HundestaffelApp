import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AddColoredCirclePage} from './add-colored-circle';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
	declarations: [
		AddColoredCirclePage,
	],
	imports: [
		IonicPageModule.forChild(AddColoredCirclePage),
		TranslateModule.forChild()
	],
})
export class AddColoredCirclePageModule {
}
