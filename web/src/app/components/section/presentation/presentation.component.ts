import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../../reveal-on-scroll.directive';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-presentation',
  imports: [ RevealOnScrollDirective, MatIcon ],
  templateUrl: './presentation.component.html',
  styleUrl: './presentation.component.css'
})
export class PresentationComponent {

}
