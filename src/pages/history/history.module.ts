import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HistoryPage} from './history';
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage";
import {IonicStorageModule} from "@ionic/storage";
import {TranslateModule} from "@ngx-translate/core";
import {TrailListModule} from "../../components/trail-list/trail-list.module";

@NgModule({
	declarations: [
		HistoryPage,
	],
	imports: [
		IonicPageModule.forChild(HistoryPage),
		IonicStorageModule.forRoot(),
		TranslateModule.forChild(),
		TrailListModule
	],
	providers: [TrailStorageProvider]
})
export class HistoryPageModule {}
