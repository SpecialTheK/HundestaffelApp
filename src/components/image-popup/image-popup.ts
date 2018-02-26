import {Component} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";

@Component({
	template: '<image-popup (click)="dismiss()"><img src="{{source}}"></image-popup>'
})
export class ImagePopupComponent {
	
	source: string;
	
	constructor(navParams: NavParams, public viewCtrl: ViewController) {
		this.source = navParams.get('source');
	}
	
	dismiss() {
		console.log("SOURCE:"+this.source);
		this.viewCtrl.dismiss();
	}
}
