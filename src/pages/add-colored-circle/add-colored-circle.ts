import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-add-colored-circle',
    templateUrl: 'add-colored-circle.html',
})
export class AddColoredCirclePage {

    circleOpacity: number = 8;
    circleColor: string = '#ff0000';

    constructor(public navParams: NavParams, public viewCtrl: ViewController) {
    }

    ionViewDidLoad() {
    }

    changeColor(color){
        this.circleColor = color;
    }

    addCircle() {
        this.navParams.get('map').addColoredCircle(this.circleColor, (this.circleOpacity/10));
        this.viewCtrl.dismiss();
    }

}
