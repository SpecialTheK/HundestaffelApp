import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { LandMapPage } from '../land-map/land-map';
import { WaterMapPage } from '../water-map/water-map';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    constructor(public navCtrl: NavController) {
    }

    ionViewDidLoad() {

    }

    gotoLandMap() {
        this.navCtrl.push('LandMapPage');
    }

    gotoWaterMap() {
        this.navCtrl.push('WaterMapPage');
    }
    
    gotoHistory() {
    	this.navCtrl.push('HistoryPage')
    }

}
