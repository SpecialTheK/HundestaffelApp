import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryEntryPage } from './history-entry';

@NgModule({
  declarations: [
    HistoryEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(HistoryEntryPage),
  ],
})
export class HistoryEntryPageModule {}
