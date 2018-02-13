import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HistoryEntryPage} from './history-entry';
import {TranslateModule} from "@ngx-translate/core";
import {ShareTrailProvider} from "../../providers/share-trail/share-trail";
import {PdfUtilProvider} from "../../providers/pdf-util/pdf-util";
import {SocialSharing} from "@ionic-native/social-sharing";

@NgModule({
	declarations: [
		HistoryEntryPage,
	],
	imports: [
		IonicPageModule.forChild(HistoryEntryPage),
		TranslateModule.forChild(),
		SocialSharing
	],
	providers: [ShareTrailProvider, PdfUtilProvider]
})
export class HistoryEntryPageModule {
}
