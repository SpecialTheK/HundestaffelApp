import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { MapProvider } from '../../providers/map/map';

@IonicPage()
@Component({
  selector: 'page-land-map',
  templateUrl: 'land-map.html',
})
export class LandMapPage {

    @ViewChild('map') mapElement: ElementRef;

    constructor(public map: MapProvider) {
    }

    ionViewDidLoad() {
      this.map.initMap(this.mapElement);
    }

}
