import { Component } from '@angular/core';
import {NavParams} from 'ionic-angular';

import {Trail} from '../../models/trail';

@Component({
  selector: 'dog-list',
  templateUrl: 'dog-list.html'
})
export class DogListComponent {

  trails: Trail[];
  map: any;

  constructor(public navParams: NavParams) {
      this.trails = this.navParams.get('trails');
      this.map = this.navParams.get('map');
  }

  onDogSelect(index){
      this.map.setWaterDogTrail(this.trails[index]);
  }

  onCircleSelect(index){
      this.map.setWaterDogTrail(this.trails[index]);

  }

}
