import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AppPreferences} from "@ionic-native/app-preferences";
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html',
})
export class SettingsPage {
	
	public language: string = "en";
	public unit: string = "m";
	public username: string = "";
	
	constructor(public navCtrl: NavController, public navParams: NavParams, public preferences: AppPreferences, public translateService: TranslateService) {
	}
	
	/**
	 * Load the preferences and update the input fields
	 */
	ionViewDidLoad() {
		this.getLanguage();
		this.getUnit();
		this.getUsername();
	}
	
	/**
	 * Get the preferred language from the app preferences
	 */
	getLanguage(){
		this.preferences.fetch('language').then((answer) => {
			this.language = answer;
		});
	}
	
	/**
	 * Get the preferred unit of measurement from the app preferences
	 */
	getUnit(){
		this.preferences.fetch('unitOfMeasurement').then((answer) => {
			this.unit = answer;
		});
	}
	
	/**
	 * Get the username from the app preferences
	 */
	getUsername(){
		this.preferences.fetch('username').then((answer) => {
			this.username = answer;
		});
	}
	
	/**
	 * Save the updated language in the preferences
	 */
	setLanguage(){
		this.preferences.store('language', this.language).then((answer) => {
			this.translateService.use(this.language);
		}).catch((reason) => {
			console.log('language not changed');
			this.getLanguage();
		});
	}
	
	/**
	 * Save the updated unit of measurement in the preferences
	 */
	setUnit() {
		this.preferences.store('unitOfMeasurement', this.unit).catch((reason) => {
			this.getUnit();
		});
	}
	
	/**
	 * Save the updated username in the preferences
	 */
	setUsername(){
		this.preferences.store('username', this.username).catch((reason) => {
			this.getUsername();
		});
	}
}
