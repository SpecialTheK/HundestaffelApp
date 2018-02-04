import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddTrianglePage } from './add-triangle';

@NgModule({
  declarations: [
    AddTrianglePage,
  ],
  imports: [
    IonicPageModule.forChild(AddTrianglePage),
  ],
})
export class AddTrianglePageModule {}
