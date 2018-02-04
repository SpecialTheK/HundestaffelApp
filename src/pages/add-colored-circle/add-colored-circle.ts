import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-add-colored-circle',
    templateUrl: 'add-colored-circle.html',
})
export class AddColoredCirclePage {

    constructor(public navParams: NavParams, public viewCtrl: ViewController) {
    }

    ionViewDidLoad() {
    }

    addCircle() {
        this.navParams.get('map').addColoredCircle('#FF00FF');
        this.viewCtrl.dismiss();
    }

}
