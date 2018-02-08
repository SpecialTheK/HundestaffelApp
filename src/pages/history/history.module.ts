import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HistoryPage} from './history';
import {ShareTrailProvider} from "../../providers/share-trail/share-trail";
import {File} from "@ionic-native/file";
import {SocialSharing} from "@ionic-native/social-sharing";
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage";
import {IonicStorageModule} from "@ionic/storage";
import {TrailCardModule} from "../../components/trail-card/trail-card.module";

@NgModule({
	declarations: [
		HistoryPage,
	],
	imports: [
		IonicPageModule.forChild(HistoryPage),
		IonicStorageModule.forRoot(),
		TrailCardModule
	],
	providers: [ShareTrailProvider, File, SocialSharing, TrailStorageProvider]
})
export class HistoryPageModule {}
