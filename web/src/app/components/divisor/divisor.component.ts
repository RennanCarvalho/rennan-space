import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-divisor',
  standalone: true,
  template: `
    <div class="divisor" [class.reverse]="isReverse"></div>
  `,
  styleUrls: ['./divisor.component.css']
})
export class DivisorComponent {
  @Input() isReverse = false;
}
