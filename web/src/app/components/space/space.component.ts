import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { SpaceService } from '../../services/space.service';

enum EObject {
  brownStar = 'var(--color-brownstar)',
  redStar = 'var(--color-redstar)',
  whiteStar = 'var(--color-whitestar)',
  neutronStar = 'var(--color-neutronstar)',
  rockyPlanet = 'var(--color-rockyplanet)',
  gasPlanet = 'var(--color-gasplanet)',
}
const STAR_COLORS = Object.values(EObject) as EObject[];

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrl: './space.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SpaceComponent {
  @ViewChild('space') space!: ElementRef<HTMLDivElement>;
  @ViewChild('explosion') explosion!: ElementRef<HTMLDivElement>;

  private stars: HTMLElement[] = [];
  private content!: HTMLElement;

  private maxStars = 500;
  private generateIndex = 0;
  private rewriteIndex = 0;

  private generateBatch = 50;
  private rewriteBatch = 50;

  private rewriteFrameId: number | null = null;

  private canRewrite = true;
  private canCinematic = true;

  private COOLDOWN = 20000;

  constructor(private spaceService: SpaceService) {}

  ngOnInit() {
    this.spaceService.rewrite$.subscribe(() => this.startRewrite());
    this.spaceService.bigbang$.subscribe(() => this.BigBang());
  }

  ngAfterViewInit() {
    this.adjustStarCount();
    this.generateStars();
    this.content = document.querySelector('.content') as HTMLElement;
  }

  ngOnDestroy() {
    if (this.rewriteFrameId) cancelAnimationFrame(this.rewriteFrameId);
  }

  private adjustStarCount() {
    const area = window.innerWidth * window.innerHeight;
    this.maxStars = area < 400_000 ? 200 : area < 800_000 ? 300 : 500;
  }

  private rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateStars() {
    const step = () => {
      const fragment = document.createDocumentFragment();
      const end = Math.min(this.generateIndex + this.generateBatch, this.maxStars);

      for (let i = this.generateIndex; i < end; i++) {
        const star = document.createElement('star');
        star.style.setProperty('--star-height', `${this.rand(1, 2)}px`);
        star.style.setProperty('--star-top', `${this.rand(0, 100)}%`);
        star.style.setProperty('--star-left', `${this.rand(0, 100)}%`);
        star.style.setProperty('--star-color', STAR_COLORS[this.rand(0, STAR_COLORS.length - 1)]);
        star.style.setProperty('--animation-duration', `${this.rand(4, 14)}s`);
        star.style.setProperty('--transition-duration', `${this.rand(4, 8)}s`);

        fragment.appendChild(star);
        this.stars.push(star);
      }

      this.space.nativeElement.appendChild(fragment);
      this.generateIndex = end;

      if (this.generateIndex < this.maxStars) requestAnimationFrame(step);
    };

    this.generateIndex = 0;
    step();
  }

  private rewriteStarsStep() {
    if (this.rewriteIndex >= this.stars.length) {
      this.finishRewrite();
      return;
    }

    const end = Math.min(this.rewriteIndex + this.rewriteBatch, this.stars.length);
    for (let i = this.rewriteIndex; i < end; i++) {
      const star = this.stars[i];
      star.style.setProperty('--star-top', `${this.rand(0, 100)}%`);
      star.style.setProperty('--star-left', `${this.rand(0, 100)}%`);
      star.style.setProperty('--star-height', `${this.rand(1, 3)}px`);
    }

    this.rewriteIndex = end;
    this.rewriteFrameId = requestAnimationFrame(() => this.rewriteStarsStep());
  }

  private finishRewrite() {
    this.rewriteIndex = 0;
    this.canRewrite = false;
    setTimeout(() => (this.canRewrite = true), this.COOLDOWN);
    this.rewriteFrameId = null;
  }

  startRewrite() {
    if (!this.canRewrite || this.rewriteFrameId) return;
    this.rewriteIndex = 0;
    this.rewriteStarsStep();
  }

  BigBang() {
    if (!this.canRewrite || !this.content) return;

    this.triggerCinematic();

    this.stars.forEach(star => star.classList.add('bigbang'));

    setTimeout(() => {
      this.stars.forEach(star => star.classList.remove('bigbang'));
      this.startRewrite();
    }, 10000);
  }

  private triggerCinematic() {
    if (!this.canCinematic) return;

    this.canCinematic = false;
    this.content.classList.remove('fade-in-out');
    this.explosion.nativeElement.classList.remove('active');
    
    void this.content.offsetWidth;
    void this.explosion.nativeElement.offsetWidth;

    this.content.classList.add('fade-in-out');   
    this.explosion.nativeElement.classList.add('active');

    setTimeout(() => (this.canCinematic = true), this.COOLDOWN);
  }
}
