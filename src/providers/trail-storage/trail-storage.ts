import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class TrailStorageProvider {

  constructor(public storage: Storage) {
  }

  saveTrail(trailObj, timeStamp){
  }

  useTrail(trail){

  }

  viewTrail(trail){

  }

}
