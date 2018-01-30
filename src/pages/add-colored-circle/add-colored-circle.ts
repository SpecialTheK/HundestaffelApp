import { Component } from '@angular/core';
import { IonicPage} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-add-colored-circle',
    templateUrl: 'add-colored-circle.html',
})
export class AddColoredCirclePage {

    circleColor: any;

    colors = {
        'red': {
            'bg': '#ff0000'
        },
        'green': {
            'bg': '#00ff00'
        },
        'blue': {
            'bg': '#0000ff'
        }
    };

    constructor() {
    }

    ionViewDidLoad() {
    }

    selectColor(color){
        this.circleColor = this.colors[color].bg;
        console.log(this.circleColor);
    }

}
