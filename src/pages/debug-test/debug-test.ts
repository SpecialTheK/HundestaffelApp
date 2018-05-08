import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { WebServiceProvider } from "../../providers/web-service/web-service";

@IonicPage()
@Component({
  selector: 'page-debug-test',
  templateUrl: 'debug-test.html',
})
export class DebugTestPage {

  constructor(public webservice: WebServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('Your are not supposed to be here!');
  }

}
