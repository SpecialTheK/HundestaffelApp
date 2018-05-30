import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebugTestPage } from './debug-test';

@NgModule({
  declarations: [
    DebugTestPage,
  ],
  imports: [
    IonicPageModule.forChild(DebugTestPage),
  ],
})
export class DebugTestPageModule {}
