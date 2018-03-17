import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HistoryEntryPage} from './history-entry';
import {TranslateModule} from "@ngx-translate/core";
import {ShareTrailProvider} from "../../providers/share-trail/share-trail";
import {PdfUtilProvider} from "../../providers/pdf-util/pdf-util";
import {SocialSharing} from "@ionic-native/social-sharing";
import {File} from "@ionic-native/file";
import {Diagnostic} from "@ionic-native/diagnostic";

@NgModule({
	declarations: [
		HistoryEntryPage,
	],
	imports: [
		IonicPageModule.forChild(HistoryEntryPage),
		TranslateModule.forChild()
	],
	providers: [ShareTrailProvider, File, SocialSharing, PdfUtilProvider, Diagnostic]
})
export class HistoryEntryPageModule {
}
