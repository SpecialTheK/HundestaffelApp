import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {TrailListComponent} from "./trail-list/trail-list";
import {TrailCardComponent} from "./trail-card/trail-card";
import {FilterComponent} from "./filter/filter";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "ionic-angular";
import { DetailsFormComponent } from './details-form/details-form';
import { DogListComponent } from './dog-list/dog-list';

/**
 * Module containing all components for lazyLoading purposes.
 */
@NgModule({
	declarations: [
		TrailListComponent,
		TrailCardComponent,
		FilterComponent,
        DetailsFormComponent,
    	DogListComponent
	],
	imports: [
		IonicModule,
		CommonModule,
		TranslateModule.forChild()
	],
	exports: [
		TrailListComponent,
		TrailCardComponent,
		FilterComponent,
        DetailsFormComponent,
    	DogListComponent
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	entryComponents: [FilterComponent,DetailsFormComponent,DogListComponent]
})
export class ComponentsModule {}
