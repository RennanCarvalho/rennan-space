import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SpaceService } from '../../services/space.service';

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

  private stars: HTMLElement[] = [];
  private content!: HTMLElement;
  private maxStars = 500; // valor padrão

  private generateIndex = 0;
  private rewriteIndex = 0;

  private generateBatchSize = 50;
  private rewriteBatchSize = 50;

  private canRewrite = true;
  private rewriteCooldown = 20000;

  private rewriteFrameId: number | null = null;

  constructor(private spaceService: SpaceService) {}

  ngOnInit() {
    this.spaceService.rewrite$.subscribe(() => this.startRewrite());
    this.spaceService.bigbang$.subscribe(() => this.BigBang());
  }
  ngAfterViewInit() {
    this.adjustStarCountForScreen();
    this.Generate();
    this.content = document.querySelector('.content') as HTMLElement;
  }

  private adjustStarCountForScreen() {
    const area = window.innerWidth * window.innerHeight;

    if (area < 400_000) {
      this.maxStars = 200; // telinha pequena
    } else if (area < 800_000) {
      this.maxStars = 300; // tablet ou celular maior
    } else {
      this.maxStars = 500; // desktop normal
    }
  }

  ngOnDestroy() {
    if (this.rewriteFrameId !== null) {
      cancelAnimationFrame(this.rewriteFrameId);
    }
  }

  private getRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  Generate() {
    const step = () => {
      const fragment = document.createDocumentFragment();
      const end = Math.min(this.generateIndex + this.generateBatchSize, this.maxStars);

      for (let i = this.generateIndex; i < end; i++) {
        const star = document.createElement('star');
        star.style.setProperty('--star-height', `${this.getRandom(1, 2)}px`);
        star.style.setProperty('--star-top', `${this.getRandom(0, 100)}%`);
        star.style.setProperty('--star-left', `${this.getRandom(0, 100)}%`);
        star.style.setProperty(
          '--star-color',
          values[this.getRandom(0, values.length - 1)]
        );
        star.style.setProperty(
          '--animation-duration',
          `${this.getRandom(4, 14)}s`
        );
        star.style.setProperty(
          '--transition-duration',
          `${this.getRandom(4, 8)}s`
        );

        fragment.appendChild(star);
        this.stars.push(star);
      }

      this.space.nativeElement.appendChild(fragment);
      this.generateIndex = end;

      if (this.generateIndex < 500) {
        requestAnimationFrame(step);
      }
    };

    this.generateIndex = 0;
    step();
  }

  private rewriteStep() {
    if (this.rewriteIndex >= this.stars.length) {
      this.rewriteIndex = 0;
      this.canRewrite = false;
      setTimeout(() => (this.canRewrite = true), this.rewriteCooldown);
      this.rewriteFrameId = null;
      return;
    }

    const end = Math.min(
      this.rewriteIndex + this.rewriteBatchSize,
      this.stars.length
    );
    for (let i = this.rewriteIndex; i < end; i++) {
      const star = this.stars[i];
      star.style.setProperty('--star-top', `${this.getRandom(0, 100)}%`);
      star.style.setProperty('--star-left', `${this.getRandom(0, 100)}%`);
      star.style.setProperty('--star-height', `${this.getRandom(1, 3)}px`);
    }

    this.rewriteIndex = end;
    this.rewriteFrameId = requestAnimationFrame(() => this.rewriteStep());
  }

  startRewrite() {
    if (!this.canRewrite || this.rewriteFrameId !== null) return;
    this.rewriteIndex = 0;
    this.rewriteStep();
  }

  BigBang() {
    if (!this.canRewrite) return;
    if (!this.content) return;

    this.FadeInOut();

    for (const star of this.stars) {
      star.classList.add('bigbang');
    }
    setTimeout(() => {
      for (const star of this.stars) {
        star.classList.remove('bigbang');
      }

      this.startRewrite();
    }, 10000);
  }

  FadeInOut() {
    this.content.classList.remove('fade-in-out');
    void this.content.offsetWidth;
    this.content.classList.add('fade-in-out');
  }
}
