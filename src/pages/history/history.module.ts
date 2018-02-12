import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HistoryPage} from './history';
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage";
import {IonicStorageModule} from "@ionic/storage";
import {TrailCardModule} from "../../components/trail-card/trail-card.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
	declarations: [
		HistoryPage,
	],
	imports: [
		IonicPageModule.forChild(HistoryPage),
		IonicStorageModule.forRoot(),
		TranslateModule.forChild(),
		TrailCardModule
	],
	providers: [TrailStorageProvider]
})
export class HistoryPageModule {}
