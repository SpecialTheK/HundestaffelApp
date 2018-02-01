import { Component } from '@angular/core';

/**
 * Generated class for the HamburgerMenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'hamburger-menu',
  templateUrl: 'hamburger-menu.html'
})
export class HamburgerMenuComponent {

  text: string;

  constructor() {
    console.log('Hello HamburgerMenuComponent Component');
    this.text = 'Hello World';
  }

}
