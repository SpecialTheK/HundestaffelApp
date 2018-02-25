import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WaterMapPage } from './water-map';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        WaterMapPage,
    ],
    imports: [
        IonicPageModule.forChild(WaterMapPage),
        TranslateModule.forChild()
    ],
})
export class WaterMapPageModule {}
