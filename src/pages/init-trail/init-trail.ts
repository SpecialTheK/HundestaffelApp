import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Page called before starting the recording of a new trail to set a few variables.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@IonicPage()
@Component({
    selector: 'page-init-trail',
    templateUrl: 'init-trail.html',
})
export class InitTrailPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }
}
