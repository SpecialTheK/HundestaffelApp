import { Component } from '@angular/core';

/**
 * Generated class for the TrailCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'trail-card',
  templateUrl: 'trail-card.html'
})
export class TrailCardComponent {

  text: string;

  constructor() {
    console.log('Hello TrailCardComponent Component');
    this.text = 'Hello World';
  }

}
