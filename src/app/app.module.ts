import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';

import {MapProvider} from '../providers/map/map';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {AppPreferences} from "@ionic-native/app-preferences";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@NgModule({
	declarations: [
		MyApp,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		IonicModule.forRoot(MyApp),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (translateLoader),
				deps: [HttpClient]
			}
		})
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp
	],
	providers: [
		MapProvider,
		StatusBar,
		SplashScreen,
		AppPreferences,
		{provide: ErrorHandler, useClass: IonicErrorHandler}
	]
})
export class AppModule {
}

export function translateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}