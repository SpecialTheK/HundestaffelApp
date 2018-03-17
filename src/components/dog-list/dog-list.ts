import { Component } from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';

import {Trail} from '../../models/trail';

@Component({
  selector: 'dog-list',
  templateUrl: 'dog-list.html'
})
export class DogListComponent {

  trails: Trail[];
  map: any;

  constructor(public navParams: NavParams, public viewCtrl: ViewController) {
      this.trails = this.navParams.get('trails');

      this.map = this.navParams.get('map');
  }

  onDogSelect(index){
      this.map.setWaterDogTrail(this.trails[index]);
      if(this.map.waterDogTrail.isHidden){
          this.map.waterDogTrail.show(this.map.mapObject);
      }else {
          this.map.waterDogTrail.hide();
      }
  }

  onCircleSelect(index, opacity){
      this.map.setWaterDogTrail(this.trails[index]);
      this.map.addCircle(opacity);
      this.viewCtrl.dismiss();
  }

}
