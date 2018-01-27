import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LandMapPage } from './land-map';

@NgModule({
  declarations: [
    LandMapPage,
  ],
  imports: [
    IonicPageModule.forChild(LandMapPage),
  ],
})
export class LandMapPageModule {}
