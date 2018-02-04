import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-add-triangle',
  templateUrl: 'add-triangle.html',
})
export class AddTrianglePage {

  constructor(public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
  }

  addTriangle() {
      this.navParams.get('map').addTriangle();
      this.viewCtrl.dismiss();
  }

}
