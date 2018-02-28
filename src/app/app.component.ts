import {Component, NgZone, ViewChild} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {Home} from '../pages/pages';
import {TranslateService} from "@ngx-translate/core";
import {AppPreferences} from "@ionic-native/app-preferences";
import {WebIntent} from "@ionic-native/web-intent";
import {TrailStorageProvider} from "../providers/trail-storage/trail-storage";
import {TrailSet} from "../models/trailSet";

// Needed outside of class as this has to be executed before the app is loaded
(window as any).handleOpenURL = (url: string) => {
	(window as any).handleOpenURL_LastURL = url;
};

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild('mainMenu') navCtrl: NavController;
	rootPage: any = Home;
	trails: TrailSet[] = [];

	constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, preferences: AppPreferences, translate: TranslateService, public webIntent: WebIntent, public storage: TrailStorageProvider, public ngZone: NgZone) {
		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			if(platform.is('android')) {
				this.webIntent.getIntent().then((answer) => {
					if(answer != null && answer.data !== undefined){
						this.navCtrl.push('ImportPage', {source: answer.data});
					}
				}, (reason) => {
					console.log("File not imported: "+reason);
				});
			}
			if(platform.is('ios')){
				(window as any).handleOpenURL = (url: string) => {
					// this context is called outside of angular zone!
					setTimeout(() => {
						// so we need to get back into the zone..
						this.ngZone.run(() => {
							// this is in the zone again..
							this.navCtrl.push('ImportPage', {source: url});
						});
					}, 0);
				};
			}
			/*let dummy = {"creationID":"1519585514006","isLandTrail":true,"isSharedTrail":false,"isTraining":true,"preSituation":"","situation":"Gesucht","temperature":"20","precipitation":"MAP_PRECIPITATION_2","risks":"","person":{"name":"Heinz","age":0,"glasses":false,"hair_choice":"Bald","hairColor_choice":"Brown","body_choice":"Slim","allergies":"Keine","illness":"Keine","medication":"Keine","image":""},"trails":[{"id":0,"startTime":"2018-02-25T18:36:56.618Z","endTime":"2018-02-25T18:58:34.018Z","distance":3117.3894251041625,"trainer":"Trainer","dog":"Hund","path":[{"lat":52.2775968,"lng":8.0299284},{"lat":52.2776083,"lng":8.0299853},{"lat":52.277658,"lng":8.0300863},{"lat":52.2776807,"lng":8.0301283},{"lat":52.2776697,"lng":8.0300035},{"lat":52.2776461,"lng":8.0299057},{"lat":52.2776166,"lng":8.0298155},{"lat":52.2776028,"lng":8.0296453},{"lat":52.2775372,"lng":8.0295725},{"lat":52.2774835,"lng":8.029352},{"lat":52.2774799,"lng":8.029403},{"lat":52.2775217,"lng":8.0292588},{"lat":52.2774893,"lng":8.0291902},{"lat":52.2774623,"lng":8.0291932},{"lat":52.2774642,"lng":8.0292014},{"lat":52.2774899,"lng":8.0287714},{"lat":52.2774899,"lng":8.0287714},{"lat":52.2774819,"lng":8.0287719},{"lat":52.2774783,"lng":8.0287137},{"lat":52.2773629,"lng":8.0273025},{"lat":52.277274,"lng":8.0271934},{"lat":52.2774192,"lng":8.0269661},{"lat":52.2774929,"lng":8.0268277},{"lat":52.2775651,"lng":8.0267583},{"lat":52.2775564,"lng":8.0266892},{"lat":52.2776643,"lng":8.0266642},{"lat":52.2776495,"lng":8.0266194},{"lat":52.277639,"lng":8.0265941},{"lat":52.277549,"lng":8.0265747},{"lat":52.2775458,"lng":8.02652},{"lat":52.2775454,"lng":8.0265163},{"lat":52.277578,"lng":8.0264438},{"lat":52.2776397,"lng":8.0261056},{"lat":52.2776751,"lng":8.0257916},{"lat":52.2777539,"lng":8.0256406},{"lat":52.2777501,"lng":8.0255784},{"lat":52.2777495,"lng":8.0255522},{"lat":52.2777368,"lng":8.0255407},{"lat":52.2777459,"lng":8.0255081},{"lat":52.2776901,"lng":8.0254217},{"lat":52.2775378,"lng":8.0252918},{"lat":52.277546,"lng":8.0251748},{"lat":52.2775661,"lng":8.0250512},{"lat":52.2776049,"lng":8.0249539},{"lat":52.2776145,"lng":8.0249043},{"lat":52.2776771,"lng":8.0248076},{"lat":52.2777021,"lng":8.0244353},{"lat":52.2776887,"lng":8.0243833},{"lat":52.277672,"lng":8.0240989},{"lat":52.277663,"lng":8.0240129},{"lat":52.2776934,"lng":8.0238715},{"lat":52.2777051,"lng":8.0236028},{"lat":52.27773,"lng":8.0234821},{"lat":52.2777256,"lng":8.0234147},{"lat":52.2777968,"lng":8.0232468},{"lat":52.2779207,"lng":8.0233133},{"lat":52.2780296,"lng":8.0231665},{"lat":52.2780933,"lng":8.0231012},{"lat":52.2784428,"lng":8.0227415},{"lat":52.2785467,"lng":8.0229363},{"lat":52.2785551,"lng":8.0227305},{"lat":52.2785947,"lng":8.0227627},{"lat":52.278548,"lng":8.0227286},{"lat":52.2785978,"lng":8.0227259},{"lat":52.2785871,"lng":8.02275},{"lat":52.2786232,"lng":8.0227218},{"lat":52.2786763,"lng":8.0227786},{"lat":52.2786673,"lng":8.0227612},{"lat":52.2787425,"lng":8.0227813},{"lat":52.2789351,"lng":8.022915},{"lat":52.278902,"lng":8.0229629},{"lat":52.2790656,"lng":8.0230944},{"lat":52.2790699,"lng":8.0230971},{"lat":52.2791853,"lng":8.0229755},{"lat":52.2792749,"lng":8.0230359},{"lat":52.279499,"lng":8.0228961},{"lat":52.2795366,"lng":8.022856},{"lat":52.2796164,"lng":8.0228495},{"lat":52.279595,"lng":8.0228407},{"lat":52.2795762,"lng":8.022833},{"lat":52.2795948,"lng":8.0228916},{"lat":52.2796008,"lng":8.0228799},{"lat":52.2795709,"lng":8.022977},{"lat":52.2795421,"lng":8.0230709},{"lat":52.2795103,"lng":8.0231743},{"lat":52.279477,"lng":8.0232825},{"lat":52.2794437,"lng":8.0233906},{"lat":52.2794949,"lng":8.0234272},{"lat":52.2795358,"lng":8.0234564},{"lat":52.2795704,"lng":8.0234812},{"lat":52.2796334,"lng":8.0235263},{"lat":52.2806846,"lng":8.0251802},{"lat":52.2810496,"lng":8.0257546},{"lat":52.2811962,"lng":8.0259853},{"lat":52.2812476,"lng":8.026066},{"lat":52.2805633,"lng":8.0253417},{"lat":52.2803249,"lng":8.0250893},{"lat":52.2802288,"lng":8.0249875},{"lat":52.2801937,"lng":8.0249504},{"lat":52.2801815,"lng":8.0249375},{"lat":52.2801772,"lng":8.0249329},{"lat":52.2817393,"lng":8.023203},{"lat":52.2820984,"lng":8.0228053},{"lat":52.2822114,"lng":8.0226802},{"lat":52.2822439,"lng":8.0226442},{"lat":52.2822542,"lng":8.0226328},{"lat":52.2822562,"lng":8.0226306},{"lat":52.2823802,"lng":8.0222336},{"lat":52.2825567,"lng":8.0222944},{"lat":52.2825713,"lng":8.0222414},{"lat":52.2825093,"lng":8.0222858},{"lat":52.282499,"lng":8.0222971},{"lat":52.2825501,"lng":8.0225512},{"lat":52.2826153,"lng":8.0226802},{"lat":52.2826437,"lng":8.0231392},{"lat":52.2827099,"lng":8.0234307},{"lat":52.2827095,"lng":8.0234012},{"lat":52.2826909,"lng":8.0234223},{"lat":52.2827925,"lng":8.0234889},{"lat":52.2828347,"lng":8.023462},{"lat":52.2829243,"lng":8.0236069},{"lat":52.2830027,"lng":8.0237583},{"lat":52.283036,"lng":8.0237573},{"lat":52.2830727,"lng":8.0237657},{"lat":52.2832016,"lng":8.0236672},{"lat":52.2833058,"lng":8.0236197},{"lat":52.283482,"lng":8.0235442},{"lat":52.2835468,"lng":8.0236063},{"lat":52.2836624,"lng":8.0236418},{"lat":52.2836694,"lng":8.0236546},{"lat":52.2838106,"lng":8.023628},{"lat":52.2839276,"lng":8.0236995},{"lat":52.2840464,"lng":8.0238797},{"lat":52.2841827,"lng":8.0239228},{"lat":52.2842405,"lng":8.0242102},{"lat":52.2843272,"lng":8.0242487},{"lat":52.2842145,"lng":8.0237512},{"lat":52.2842451,"lng":8.0237204},{"lat":52.2843451,"lng":8.0239515},{"lat":52.2844455,"lng":8.0240062},{"lat":52.2844635,"lng":8.0245081},{"lat":52.28441,"lng":8.0247682},{"lat":52.2845922,"lng":8.0242694},{"lat":52.2845329,"lng":8.0239779},{"lat":52.2846124,"lng":8.0237227},{"lat":52.2846788,"lng":8.0234866},{"lat":52.2848931,"lng":8.0223682},{"lat":52.2848046,"lng":8.0225796},{"lat":52.2847733,"lng":8.0223982},{"lat":52.284876,"lng":8.0222717},{"lat":52.2848545,"lng":8.0223376},{"lat":52.2848463,"lng":8.0222122},{"lat":52.2848276,"lng":8.02211},{"lat":52.2847546,"lng":8.0219289},{"lat":52.2847394,"lng":8.0218063},{"lat":52.2847309,"lng":8.0216558},{"lat":52.2847436,"lng":8.0216036},{"lat":52.2849108,"lng":8.0215245},{"lat":52.285042,"lng":8.0214009},{"lat":52.2851426,"lng":8.0213398},{"lat":52.2851789,"lng":8.021315},{"lat":52.2852439,"lng":8.0213026},{"lat":52.2854611,"lng":8.0211724},{"lat":52.285497,"lng":8.0211357},{"lat":52.285552,"lng":8.0211236},{"lat":52.2855718,"lng":8.0210847},{"lat":52.2855503,"lng":8.0210665},{"lat":52.2855765,"lng":8.021113},{"lat":52.2857006,"lng":8.0211782},{"lat":52.2857707,"lng":8.0211806},{"lat":52.2859539,"lng":8.0212084},{"lat":52.2859679,"lng":8.0212355},{"lat":52.2863606,"lng":8.0211944},{"lat":52.2865578,"lng":8.0210821},{"lat":52.2866063,"lng":8.021113},{"lat":52.2866696,"lng":8.0211309},{"lat":52.2866989,"lng":8.0211263},{"lat":52.2867775,"lng":8.0210374},{"lat":52.2867824,"lng":8.0210682},{"lat":52.2867809,"lng":8.0210919},{"lat":52.2868562,"lng":8.0210484},{"lat":52.2868121,"lng":8.0209733},{"lat":52.2868063,"lng":8.020937},{"lat":52.2868784,"lng":8.0209079},{"lat":52.2869576,"lng":8.020821},{"lat":52.2871158,"lng":8.0206899},{"lat":52.2871428,"lng":8.0206337},{"lat":52.2871769,"lng":8.0205952},{"lat":52.2872116,"lng":8.0205297},{"lat":52.2872697,"lng":8.0205363},{"lat":52.2873,"lng":8.0205568},{"lat":52.287402,"lng":8.0205841},{"lat":52.2874511,"lng":8.0205764},{"lat":52.2875205,"lng":8.0206016},{"lat":52.2875886,"lng":8.0206211},{"lat":52.2876285,"lng":8.0206301},{"lat":52.287677,"lng":8.0206432},{"lat":52.2877045,"lng":8.0206369},{"lat":52.2878197,"lng":8.0206109},{"lat":52.2879255,"lng":8.0206315},{"lat":52.2880722,"lng":8.0205945},{"lat":52.2882378,"lng":8.0207511},{"lat":52.2882549,"lng":8.0207116},{"lat":52.2882875,"lng":8.0207393},{"lat":52.2884265,"lng":8.0206897},{"lat":52.2884998,"lng":8.0207578},{"lat":52.2885729,"lng":8.0208106},{"lat":52.2885897,"lng":8.0208327},{"lat":52.2886657,"lng":8.0208682},{"lat":52.2886746,"lng":8.0208853},{"lat":52.2888559,"lng":8.0209067},{"lat":52.2888839,"lng":8.0209044},{"lat":52.2889396,"lng":8.0208578},{"lat":52.2891581,"lng":8.020942},{"lat":52.2891718,"lng":8.02096},{"lat":52.289135,"lng":8.0209363},{"lat":52.2893398,"lng":8.0209976},{"lat":52.2893997,"lng":8.0210349},{"lat":52.2894932,"lng":8.0209523},{"lat":52.2896303,"lng":8.0209784},{"lat":52.2896992,"lng":8.0210051},{"lat":52.2897528,"lng":8.0210757},{"lat":52.2897746,"lng":8.0210658},{"lat":52.2897983,"lng":8.0210646},{"lat":52.2898166,"lng":8.0210612},{"lat":52.289822,"lng":8.021044},{"lat":52.2898291,"lng":8.0210635},{"lat":52.2898289,"lng":8.0210901},{"lat":52.2898275,"lng":8.0210891},{"lat":52.2898287,"lng":8.0210707},{"lat":52.2898256,"lng":8.0210801},{"lat":52.2898209,"lng":8.0210702},{"lat":52.2898418,"lng":8.0211138},{"lat":52.2898028,"lng":8.0210549},{"lat":52.2898339,"lng":8.0210604},{"lat":52.2898488,"lng":8.0211382},{"lat":52.2898479,"lng":8.0211798},{"lat":52.2898131,"lng":8.0211431},{"lat":52.2898104,"lng":8.0211268},{"lat":52.2898138,"lng":8.0211356},{"lat":52.2899092,"lng":8.0212662},{"lat":52.2899242,"lng":8.0213131},{"lat":52.2901875,"lng":8.0215615},{"lat":52.2902249,"lng":8.0216072},{"lat":52.2902252,"lng":8.021599},{"lat":52.2902254,"lng":8.021635},{"lat":52.2902199,"lng":8.0216177},{"lat":52.2902438,"lng":8.02154},{"lat":52.2902583,"lng":8.0215263},{"lat":52.290259,"lng":8.0214016},{"lat":52.2903049,"lng":8.0214122}],"marker":[{"id":0,"position":{"lat":52.2830727,"lng":8.0237657},"symbolID":1},{"id":1,"position":{"lat":52.2846124,"lng":8.0237227},"symbolID":1}],"circles":[],"triangles":[]}]};
			this.storage.addNewTrailSet(TrailSet.fromData(<any>dummy)).then((message) => {
				console.log("Geklappt");
			});*/
			
			preferences.fetch('language').then((answer) => {
				translate.use(answer);
			}).catch((error) =>{
				translate.setDefaultLang('en');
			});
			this.storage.getLatestTrailSets(5).subscribe((value:TrailSet) => {
				this.trails.push(value);
			});
			statusBar.styleDefault();
			splashScreen.hide();
		});
	}

	openPage(name){
		if(name == 'HomePage'){
			this.navCtrl.popToRoot();
		} else {
			this.navCtrl.push(name);
		}
	}

	openEntry(trailSet: TrailSet){
		this.navCtrl.push('HistoryEntryPage', {trailObject: trailSet});
	}
}
