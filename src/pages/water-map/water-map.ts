import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, ViewController, PopoverController } from 'ionic-angular';

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

    constructor(public viewCtrl: ViewController, public popoverCtrl: PopoverController, public map: MapProvider) {
    }

    ionViewDidLoad() {
        this.map.initMap(this.mapElement);
    }

    showCurrentLocation() {
        this.map.recordCurrentLocation();
    }

    stopRecording() {
        this.map.stopRecording();
        //this.viewCtrl.dismiss();
    }

    addCircle(ev) {
        let popover = this.popoverCtrl.create('AddColoredCirclePage');
        popover.present({
            ev: ev
        });

        console.log("Added Circle")
        //this.map.addColoredCircle('#ff0000');
    }

    changeOpacity() {
        this.map.changeCircleLevelDisplay((this.circleOpacity/10));
    }

}
