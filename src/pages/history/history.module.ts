import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HistoryPage} from './history';
import {ShareTrailProvider} from "../../providers/share-trail/share-trail";
import {File} from "@ionic-native/file";
import {SocialSharing} from "@ionic-native/social-sharing";

@NgModule({
	declarations: [
		HistoryPage,
	],
	imports: [
		IonicPageModule.forChild(HistoryPage),
	],
	providers: [ShareTrailProvider, File, SocialSharing]
})
export class HistoryPageModule {}
