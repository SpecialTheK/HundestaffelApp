import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

import { MapProvider } from '../../providers/map/map';

@IonicPage()
@Component({
    selector: 'page-land-map',
    providers: [ MapProvider ],
    templateUrl: 'land-map.html',
})
export class LandMapPage {

    @ViewChild('map') mapElement: ElementRef;

    constructor(public viewCtrl: ViewController, public map: MapProvider) {
    }

    ionViewDidLoad() {
        this.map.initMap(this.mapElement);
    }

    showCurrentLocation(){
        this.map.recordCurrentLocation();
    }

    stopRecording() {
        this.map.stopRecording();
        //this.viewCtrl.dismiss();
    }

}
