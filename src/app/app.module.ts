import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';

import {MapProvider} from '../providers/map/map';
import {MainMenuDirective} from "../directives/main-menu/main-menu";

@NgModule({
	declarations: [
		MyApp
	],
	imports: [
		BrowserModule,
		MainMenuDirective,
		IonicModule.forRoot(MyApp, {menuType: 'push',})
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp
	],
	providers: [
		MapProvider,
		StatusBar,
		SplashScreen,
		{provide: ErrorHandler, useClass: IonicErrorHandler}
	]
})
export class AppModule {
}
