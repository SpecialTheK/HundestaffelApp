import { Component, ViewChild, ElementRef } from '@angular/core';

import { LandMapProvider } from '../../providers/map/landMap';

@Component({
    selector: 'page-test',
    templateUrl: 'test.html',
})
export class TestPage {

    @ViewChild('map') mapElement: ElementRef;

    constructor(public landMap: LandMapProvider) {
    }

    ionViewDidLoad() {
        this.landMap.initMap(this.mapElement);
        this.landMap.addMarker();
    }

}
