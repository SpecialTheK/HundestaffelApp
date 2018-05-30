import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AppPreferences} from "@ionic-native/app-preferences";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';

/**
 * Settings page to let the user set his language and settings for online trailing.
 *
 * @since 1.0.0
 * @version 1.0.0
 */
@IonicPage()
@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html',
})
export class SettingsPage {
	/**
	 * Username to use in online trailing.
	 *
	 * @type {string}
	 * @since 1.0.0
	 */
	public username: string = "";

	constructor(public navCtrl: NavController, public navParams: NavParams, public preferences: AppPreferences, public translateService: TranslateService, public storage: Storage) {
	}

	/**
	 * Load the preferences and update the input fields.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	ionViewDidLoad() {
		this.getUsername();
	}

	/**
	* Just for testing and such
	* TODO: remove this methode
	*
	* @since 1.0.0
	* @version 1.0.0
	*/
	clearStorage(){
		this.storage.clear();
		console.log("STORAGE: CLEARED");
	}


	/**
	* This Method and coresponding page is of limits!
	*
	* @since 1.0.0
	* @version 1.0.0
	*/
	gotoTestPage(){
		this.navCtrl.push('DegbugTestPage');
	}

	/**
	 * Get the username from the app preferences.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	getUsername(){
		this.preferences.fetch('username').then((answer) => {
			this.username = answer;
		});
	}

	/**
	 * Save the updated username in the preferences.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	setUsername(){
		this.preferences.store('username', this.username).catch((reason) => {
			this.getUsername();
		});
	}
}
