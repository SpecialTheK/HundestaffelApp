import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavParams, ModalController } from 'ionic-angular';

import { MapProvider } from '../../providers/map/map';

@IonicPage()
@Component({
    selector: 'page-land-map',
    providers: [ MapProvider ],
    templateUrl: 'land-map.html',
})
export class LandMapPage {

    @ViewChild('map') mapElement: ElementRef;

    constructor(public navParams: NavParams, public modalCtrl: ModalController, public map: MapProvider) {
    }

    ionViewDidLoad() {
        this.map.initMap(this.mapElement);
    }

    showCurrentLocation(){
        this.map.recordCurrentPosition();
    }

    stopRecording() {
        this.map.endSession();
    }

    addMarker() {
        //console.log("Added Marker");
        //this.map.addMarker();

        let markerAdd = this.modalCtrl.create('AddMarkerPage', {map: this.map});
        markerAdd.present();
    }

}
