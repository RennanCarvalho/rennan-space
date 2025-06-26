import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';

enum EObject {
  brownStar = "var(--color-brownstar)",
  redStar = "var(--color-redstar)",
  whiteStar = "var(--color-whitestar)",
  neutronStar = "var(--color-neutronstar)",
  rockyPlanet = "var(--color-rockyplanet)",
  gasPlanet = "var(--color-gasplanet)"
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

  ngAfterViewInit(): void {
    this.BigBang();
  }

  BigBang(){
    for(let i = 0; i < 450; i++){
      const object = document.createElement('span');
      const height = Math.floor(Math.random() * 4);
      const top = Math.floor(Math.random() * 100);
      const left = Math.floor(Math.random() * 100);
      const animationDuration = Math.floor(Math.random() * 10 + 4);

      object.style.height = `${height}px`;
      object.style.top = `${top}%`;
      object.style.left = `${left}%`;
      object.style.animationDuration = `${animationDuration}s`;
      object.style.backgroundColor = values[Math.floor(Math.random() * values.length)];

      this.space.nativeElement.appendChild(object);
    }
  }
}
