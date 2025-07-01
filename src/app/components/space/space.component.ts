import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

enum EObject {
  brownStar = 'var(--color-brownstar)',
  redStar = 'var(--color-redstar)',
  whiteStar = 'var(--color-whitestar)',
  neutronStar = 'var(--color-neutronstar)',
  rockyPlanet = 'var(--color-rockyplanet)',
  gasPlanet = 'var(--color-gasplanet)',
}

const values = Object.values(EObject) as EObject[];

@Component({
  selector: 'app-space',
  imports: [],
  templateUrl: './space.component.html',
  styleUrl: './space.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SpaceComponent {
  @ViewChild('space') space!: ElementRef<HTMLDivElement>;

  private keyHandler = this.handleKeyPress.bind(this);

  ngAfterViewInit() {
    this.BigBang();
    window.addEventListener('keydown', this.keyHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.keyHandler);
  }

  private getRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  BigBang() {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 500; i++) {
      const object = document.createElement('span');

      const height = this.getRandom(1, 3);
      const top = this.getRandom(0, 100);
      const left = this.getRandom(0, 100);
      const animationDuration = this.getRandom(4, 14);
      const color = values[this.getRandom(0, values.length - 1)];
      const shouldShine = Math.random() < 0.1;

      object.style.cssText = `
        height: ${height}px;
        top: ${top}%;
        left: ${left}%;
        animation-duration: ${animationDuration}s;
        background-color: ${color};
      `;

      if (shouldShine) {
        object.classList.add('brighter');
      }

      fragment.appendChild(object);
    }

    this.space.nativeElement.appendChild(fragment);
  }

  Rewrite() {
    const stars = this.space.nativeElement.children;
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i] as HTMLElement;

      const newTop = this.getRandom(0, 100);
      const newLeft = this.getRandom(0, 100);
      const newSize = this.getRandom(1, 3);

      star.style.top = `${newTop}%`;
      star.style.left = `${newLeft}%`;
      star.style.height = `${newSize}px`;
    }
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key.toLowerCase() === 'r') {
      this.Rewrite();
    }
  }
}
