import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HistoryPage} from './history';
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage";
import {IonicStorageModule} from "@ionic/storage";
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from "../../components/components.module";
import {Globalization} from "@ionic-native/globalization";

@NgModule({
	declarations: [
		HistoryPage,
	],
	imports: [
		IonicPageModule.forChild(HistoryPage),
		IonicStorageModule.forRoot(),
		TranslateModule.forChild(),
		ComponentsModule
	],
	providers: [TrailStorageProvider, Globalization]
})
export class HistoryPageModule {}
