import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from "@ionic-native/geolocation";
import { Vibration } from '@ionic-native/vibration';
import { DeviceOrientation } from '@ionic-native/device-orientation';
import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {AppPreferences} from "@ionic-native/app-preferences";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {WebIntent} from "@ionic-native/web-intent";
import {TrailStorageProvider} from "../providers/trail-storage/trail-storage";
import {IonicStorageModule} from "@ionic/storage";
import {ComponentsModule} from "../components/components.module";
import {Globalization} from "@ionic-native/globalization";
import {SQLite} from "@ionic-native/sqlite";
import { WebServiceProvider } from '../providers/web-service/web-service';

@NgModule({
	declarations: [
		MyApp
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		IonicModule.forRoot(MyApp),
		IonicStorageModule.forRoot(),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (createTranslateLoader),
				deps: [HttpClient]
			}
		}),
		ComponentsModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp
	],
	providers: [
		Geolocation,
		Camera,
		StatusBar,
		SplashScreen,
		AppPreferences,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		WebIntent,
		TrailStorageProvider,
		Vibration,
		DeviceOrientation,
		Globalization,
		SQLite,
		WebServiceProvider
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}

export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
