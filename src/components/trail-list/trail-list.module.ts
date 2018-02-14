import { NgModule } from '@angular/core';
import {TrailListComponent} from "./trail-list";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "ionic-angular";
import {TrailStorageProvider} from "../../providers/trail-storage/trail-storage";
import {TrailCardModule} from "../trail-card/trail-card.module";
@NgModule({
	declarations: [TrailListComponent],
	imports: [
		IonicModule,
		TranslateModule.forChild(),
		TrailCardModule
	],
	providers: [TrailStorageProvider],
	exports: [TrailListComponent]
})
export class TrailListModule {}
