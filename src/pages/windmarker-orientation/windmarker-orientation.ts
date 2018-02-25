import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { Marker } from '../../models/marker';

@IonicPage()
@Component({
    selector: 'page-windmarker-orientation',
    templateUrl: 'windmarker-orientation.html',
})
export class WindmarkerOrientationPage {

    editMarker: Marker;

    windDirectionOrientation: number = 0;

    constructor(public viewCtrl: ViewController, public navParams: NavParams) {
        this.editMarker = this.navParams.get('marker');
    }

    changeOrientation(){
        this.editMarker.changeOrientation(this.windDirectionOrientation);
    }

    confirm(){
        this.viewCtrl.dismiss();
    }

}
