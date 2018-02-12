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

    constructor(public modalCtrl: ModalController, public navParams: NavParams, public map: MapProvider) {
    }

    ionViewDidLoad() {
        this.map.initMap(this.mapElement);
        if(this.navParams.get('trailSet') == null){
            this.map.startSession('Jonas', 'Hund2', false, false, false);
        } else {
            this.map.startExistingSession(this.navParams.get('trailSet'), 'Jonas', 'Hund2', false, false, false);
        }
    }

    showCurrentLocation() {
        this.map.recordCurrentPosition();
    }

    stopRecording() {
        this.map.endSession();
    }

    addCircle() {
        let cricleAdd = this.modalCtrl.create('AddColoredCirclePage', {map: this.map});
        cricleAdd.present();
    }

    addMarker() {
        let markerAdd = this.modalCtrl.create('AddMarkerPage', {map: this.map});
        markerAdd.present();
    }

    addTriangle() {
        this.map.addTriangle();
    }

    changeOpacity() {

    }

}
