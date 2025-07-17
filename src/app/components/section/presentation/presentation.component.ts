import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../../reveal-on-scroll.directive';

@Component({
  selector: 'app-presentation',
  imports: [ RevealOnScrollDirective ],
  templateUrl: './presentation.component.html',
  styleUrl: './presentation.component.css'
})
export class PresentationComponent {

}
