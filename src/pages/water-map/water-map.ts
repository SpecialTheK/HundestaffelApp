import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, ModalController, NavParams } from 'ionic-angular';

import { MapProvider } from '../../providers/map/map';

@IonicPage()
@Component({
    selector: 'page-water-map',
    providers: [ MapProvider ],
    templateUrl: 'water-map.html',
})
export class WaterMapPage {

    @ViewChild('map') mapElement: ElementRef;

    circleOpacity: any = 8;

    recordingTime: Date = new Date(0);

    constructor(public modalCtrl: ModalController, public navParams: NavParams, public map: MapProvider) {
    }

    ionViewDidLoad() {
        this.map.initMap(this.mapElement);
    }

    showCurrentLocation() {
        this.map.recordCurrentPosition();
    }

    stopRecording() {
        this.recordingTime = new Date(this.map.endSession());
    }

    addCircle() {
        //console.log("Added Circle");
        //this.map.addColoredCircle('#ff0000');

        let cricleAdd = this.modalCtrl.create('AddColoredCirclePage', {map: this.map});
        cricleAdd.present();
    }

    addMarker() {
        //console.log("Added Marker");
        //this.map.addMarker();

        let markerAdd = this.modalCtrl.create('AddMarkerPage', {map: this.map});
        markerAdd.present();
    }

    addTriangle() {
        //console.log("Added Triangle");
        //this.map.addTriangle();

        let triangleAdd = this.modalCtrl.create('AddTrianglePage', {map: this.map});
        triangleAdd.present();
    }

    changeOpacity() {
        this.map.changeCircleLevelDisplay((this.circleOpacity/10));
    }

}
