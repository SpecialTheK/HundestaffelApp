import { NgModule } from '@angular/core';
import {TrailCardComponent} from "./trail-card";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "ionic-angular";
@NgModule({
	declarations: [TrailCardComponent],
	imports: [
		IonicModule,
		TranslateModule.forChild()
	],
	exports: [TrailCardComponent]
})
export class TrailCardModule {}
