import { Component } from '@angular/core';

/**
 * Generated class for the DetailsFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'details-form',
  templateUrl: 'details-form.html'
})
export class DetailsFormComponent {

  text: string;

  constructor() {
    console.log('Hello DetailsFormComponent Component');
    this.text = 'Hello World';
  }

}
