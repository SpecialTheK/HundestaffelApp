import { Directive } from '@angular/core';

/**
 * Generated class for the MainMenuDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[main-menu]' // Attribute selector
})
export class MainMenuDirective {

  constructor() {
    console.log('Hello MainMenuDirective Directive');
  }

}
