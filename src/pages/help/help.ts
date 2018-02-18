import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Page displaying informations and a little guide in order to use the app.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@IonicPage()
@Component({
	selector: 'page-help',
	templateUrl: 'help.html',
})
export class HelpPage {
	
	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}
	
	ionViewDidLoad() {
		console.log('ionViewDidLoad HelpPage');
	}
	
}
