import {Component} from '@angular/core';
import {Person} from "../../models/person";
import {NavController, NavParams, ViewController} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {Camera, CameraOptions} from "@ionic-native/camera";

@Component({
	selector: 'details-form',
	templateUrl: 'details-form.html'
})
export class DetailsFormComponent {

	multipleDogs: boolean = true;
	dogs: string[] = [];

	precipitation: string = "MAP_PRECIPITATION_0";
	temperature: number = 20;

	person: Person;
	photoExisting: boolean = false;

	situation: string = "";
	preSituation: string = "";
	risks: string = "";

	hairOptions: string[] = [];
	hairColorOptions: string[] = [];
	bodyOptions: string[] = [];
	precipitationOptions: string[] = [];
	translatedTerms: string[] = [];

	constructor(public navParams: NavParams, public navCtrl: NavController, public viewCtrl: ViewController, public translateService: TranslateService, public camera: Camera) {
		let data = this.navParams.get('data');
		this.multipleDogs = !this.navParams.get('isLandTrail');
		if(data === undefined){
			this.person = new Person();
			this.dogs.push("");
		} else {
			this.dogs = data.dogs;
			this.precipitation = data.precipitation;
			this.temperature = data.temperature;
			this.person = data.person;
			this.situation = data.situation;
			this.preSituation = data.preSituation;
			this.risks = data.risks;
			this.photoExisting = this.person.image !== "";
		}
		this.translateVariables();
	}

	/**
	 * Method called to translate all variables needed for this page.
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	private translateVariables(){
		let translateTerms = Array("MAP_PRECIPITATION_0", "MAP_PRECIPITATION_1", "MAP_PRECIPITATION_2", "MAP_PRECIPITATION_3", "MAP_PRECIPITATION_4", "PERSON_HAIR_0", "PERSON_HAIR_1", "PERSON_HAIR_2", "PERSON_HAIR_3", "PERSON_HAIR_COLOR_0", "PERSON_HAIR_COLOR_1", "PERSON_HAIR_COLOR_2", "PERSON_HAIR_COLOR_3", "PERSON_HAIR_COLOR_4", "PERSON_HAIR_COLOR_5", "PERSON_HAIR_COLOR_6", "PERSON_HAIR_COLOR_7", "PERSON_HAIR_COLOR_8", "PERSON_BODY_0", "PERSON_BODY_1", "PERSON_BODY_2", "PERSON_BODY_3", "PERSON_BODY_4");
		for(let term of translateTerms){
			this.translateService.get(term).subscribe((answer) => {
				this.translatedTerms[term.toLowerCase()] = answer;
			});
		}

		this.hairOptions = [
			this.translatedTerms["person_hair_0"],
			this.translatedTerms["person_hair_1"],
			this.translatedTerms["person_hair_2"],
			this.translatedTerms["person_hair_3"],
		];

		this.hairColorOptions = [
			this.translatedTerms["person_hair_color_0"],
			this.translatedTerms["person_hair_color_1"],
			this.translatedTerms["person_hair_color_2"],
			this.translatedTerms["person_hair_color_3"],
			this.translatedTerms["person_hair_color_4"],
			this.translatedTerms["person_hair_color_5"],
			this.translatedTerms["person_hair_color_6"],
			this.translatedTerms["person_hair_color_7"],
			this.translatedTerms["person_hair_color_8"]
		];
		this.bodyOptions = [
			this.translatedTerms["person_body_0"],
			this.translatedTerms["person_body_1"],
			this.translatedTerms["person_body_2"],
			this.translatedTerms["person_body_3"],
			this.translatedTerms["person_body_4"],
		];

		this.precipitationOptions = [
			this.translatedTerms["map_precipitation_0"],
			this.translatedTerms["map_precipitation_1"],
			this.translatedTerms["map_precipitation_2"],
			this.translatedTerms["map_precipitation_3"],
			this.translatedTerms["map_precipitation_4"]
		];
	}

	public takePicture(){
		const options : CameraOptions = {
			quality: 50, // picture quality
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE
		};
		this.camera.getPicture(options).then((imageData) => {
			this.person.image = 'data:image/jpeg;base64,' + imageData;
		}, (err) => {
			console.log(err);
		});
	}

	public customTrackBy(index: number, obj: any): any {
		return index;
	}

	public addDogInput(event, index){
		if(event.value === "" && this.dogs.length > 1){
			this.dogs.splice(index, 1);
			if((this.dogs.length - index) !== 1){
				this.dogs.push("");
			}
		}else {
			if((this.dogs.length - index) === 1){
				this.dogs.push("");
			}
		}
	}

	submitDetails(){
		let data: any = {};
		this.dogs.splice(this.dogs.length-1, 1);
		data.dogs = this.dogs;
		data.precipitation = this.precipitation;
		data.temperature = this.temperature;
		data.person = this.person;
		data.situation = this.situation;
		data.preSituation = this.preSituation;
		data.risks = this.risks;
		this.viewCtrl.dismiss(data);
	}
	
	dismiss(){
		this.viewCtrl.dismiss({'cancel': true});
	}
}
