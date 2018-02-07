import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-add-marker',
  templateUrl: 'add-marker.html',
})
export class AddMarkerPage {

    markerText: string = 'test1';
    symbolID: number = 0;

    constructor(public navParams: NavParams, public viewCtrl: ViewController) {
    }

    ionViewDidLoad() {
    }

    addMarker() {
        this.navParams.get('map').addMarker(this.markerText, this.symbolID);
        this.viewCtrl.dismiss();
    }

}
