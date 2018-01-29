import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

import { MapProvider } from '../../providers/map/map';

@IonicPage()
@Component({
    selector: 'page-water-map',
    providers: [ MapProvider ],
    templateUrl: 'water-map.html',
})
export class WaterMapPage {

    @ViewChild('map') mapElement: ElementRef;

    circleOpacity = 8;

    constructor(public viewCtrl: ViewController, public map: MapProvider) {
    }

    ionViewDidLoad() {
        this.map.initMap(this.mapElement);
    }

    showCurrentLocation() {
        console.log("Test");
        this.map.recordCurrentLocation();
    }

    stopRecording() {
        this.map.stopRecording();
        //this.viewCtrl.dismiss();
    }

    addCircle() {
        this.map.addColoredCircle('#ff00ff');
    }

    changeOpacity() {
        this.map.changeCircleLevelDisplay((this.circleOpacity/10));
    }

}
