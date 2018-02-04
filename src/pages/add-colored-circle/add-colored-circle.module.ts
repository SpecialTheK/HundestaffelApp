import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddColoredCirclePage } from './add-colored-circle';

@NgModule({
  declarations: [
    AddColoredCirclePage,
  ],
  imports: [
    IonicPageModule.forChild(AddColoredCirclePage),
  ],
})
export class AddColoredCirclePageModule {}
