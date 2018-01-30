import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WaterMapPage } from './water-map';

@NgModule({
    declarations: [
        WaterMapPage,
    ],
    imports: [
        IonicPageModule.forChild(WaterMapPage),
    ],
})
export class WaterMapPageModule {}
