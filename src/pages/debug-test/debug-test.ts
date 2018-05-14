import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { WebServiceProvider } from "../../providers/web-service/web-service";

@IonicPage()
@Component({
  selector: 'page-debug-test',
  templateUrl: 'debug-test.html',
})
export class DebugTestPage {

  private ipAddr: string = "http://localhost:8100";
  private username: string = "Christian";
  private pw: string = "pass";
  private session_id: string;

  constructor(public webservice: WebServiceProvider) {
    
  }

  ionViewDidLoad() {
    console.log('Your are not supposed to be here!');
  }

  createSession(){
    this.webservice.createSession(this.ipAddr, this.pw)
      .subscribe((res: any) => {
        if(res.hasOwnProperty("sid")){
          this.session_id = res.sid;
          console.log(this.session_id);

          this.joinSession();

          this.pw = "pass2";
        }else {
          //TODO: handle error!
        }
      });
  }

  joinSession(){
    this.webservice.joinSession(this.ipAddr, this.session_id, this.username, this.pw)
      .subscribe((res) => {
        console.log(res);
      });
  }

}
