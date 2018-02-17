import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {TrailListComponent} from "./trail-list/trail-list";
import {TrailCardComponent} from "./trail-card/trail-card";
import {FilterComponent} from "./filter/filter";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "ionic-angular";
@NgModule({
	declarations: [
		TrailListComponent,
		TrailCardComponent,
		FilterComponent
	],
	imports: [
		IonicModule,
		CommonModule,
		TranslateModule.forChild()
	],
	exports: [
		TrailListComponent,
		TrailCardComponent,
		FilterComponent
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	entryComponents: [FilterComponent]
})
export class ComponentsModule {}
